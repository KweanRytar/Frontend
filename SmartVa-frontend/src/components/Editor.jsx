import React, { useEffect, useMemo, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";

import { ListNode, ListItemNode } from "@lexical/list";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
} from "lexical";

import ToolBar from './ToolBar';
import INSERT_HEADING_COMMAND from "../commands/headingCommand";
import "../style/editor.css";

// THEME
const theme = {
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-textBold",
    italic: "editor-textItalic",
    underline: "editor-textUnderline",
  },
};

// MAIN CONFIG (Memoized to prevent remount)
const createEditorConfig = () => ({
  namespace: "MyEditor",
  theme,
  onError: (error) => console.error(error),
  nodes: [HeadingNode, ListNode, ListItemNode, TableNode, TableCellNode, TableRowNode],
});

// ---------------------- //
// LoadInitialHtmlPlugin
// ---------------------- //
const LoadInitialHtmlPlugin = ({ initialHtml }) => {
  const [editor] = useLexicalComposerContext();
  const loaded = useRef(false);

  useEffect(() => {
    if (!initialHtml || loaded.current) return;

    loaded.current = true;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();
      nodes.forEach((node) => root.append(node));
    });
  }, [editor, initialHtml]);

  return null;
};

// ---------------------- //
// InsertHeadingPlugin
// ---------------------- //
const InsertHeadingPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HEADING_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const heading = $createHeadingNode(payload);
            heading.append(...selection.extract());
            selection.insertNodes([heading]);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
};

// ---------------------- //
// UpdateListenerPlugin
// ---------------------- //
const UpdateListenerPlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const html = $generateHtmlFromNodes(editor);
        onChange({
          contentText: text,
          contentHtml: html,
        });
      });
    });
  }, [editor, onChange]);

  return null;
};

// ---------------------- //
// Editor Component
// ---------------------- //
const Editor = ({ initialHtml, onChange, disableAutoFocus = false }) => {
  const editorConfig = useMemo(() => createEditorConfig(), []);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="bg-green-400 dark:bg-gray-700 p-6 rounded-2xl shadow-md mx-auto mt-40 w-11/12 md:w-3/4 lg:w-1/2">
        <ToolBar />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="p-4 bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 rounded shadow outline-none min-h-[150px]" />
          }
          placeholder={
            <div className="text-gray-400 pointer-events-none">
              Enter some text...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      {!disableAutoFocus && <AutoFocusPlugin />}
  
      <HistoryPlugin />
      <ListPlugin />
      <InsertHeadingPlugin />
      <LoadInitialHtmlPlugin initialHtml={initialHtml} />
      <UpdateListenerPlugin onChange={onChange} />
    </LexicalComposer>
  );
};

export default Editor;
