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

import ToolBar from "./ToolBar";
import INSERT_HEADING_COMMAND from "../commands/headingCommand";
import "../style/editor.css";

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = {
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-textBold",
    italic: "editor-textItalic",
    underline: "editor-textUnderline",
  },
  list: {
    ul: "editor-list-ul",
    ol: "editor-list-ol",
    listitem: "editor-listItem",
    listItemUnchecked: "editor-listItemUnchecked",
    nested: { listitem: "editor-nested-listitem" },
  },
  root: "editor-root text-gray-900 dark:text-gray-100",
};

const createEditorConfig = () => ({
  namespace: "MyEditor",
  theme,
  onError: (error) => console.error(error),
  nodes: [HeadingNode, ListNode, ListItemNode, TableNode, TableCellNode, TableRowNode],
});

// ─── PLUGINS ──────────────────────────────────────────────────────────────────
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

const UpdateListenerPlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const html = $generateHtmlFromNodes(editor);
        onChange({ contentText: text, contentHtml: html });
      });
    });
  }, [editor, onChange]);

  return null;
};

// ─── EDITOR ───────────────────────────────────────────────────────────────────
const Editor = ({ initialHtml, onChange, disableAutoFocus = false }) => {
  const editorConfig = useMemo(() => createEditorConfig(), []);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      {/*
        ┌─ Outer shell ────────────────────────────────────────────────────────┐
        │  • flex-col so toolbar + scroll area stack vertically                │
        │  • overflow-hidden clips children — DO NOT put overflow-y here       │
        │  • h-[calc(100vh-280px)] = full viewport minus:                      │
        │      – app nav bar (~56px / md:112px)                               │
        │      – EditNote fixed header (~80px / md:80px)                      │
        │      – EditNote pt padding (~56px / md:48px)                        │
        │    Tweak the constant if your nav bar height differs.               │
        └──────────────────────────────────────────────────────────────────────┘
      */}
      <div
        className="
          flex flex-col
          bg-green-400 dark:bg-gray-700
          rounded-2xl shadow-md
          mx-auto
          w-11/12 md:w-3/4 lg:w-1/2
          dark:text-white
          overflow-hidden
          h-[calc(100vh-280px)]
          min-h-[380px]
        "
      >
        {/*
          ── Toolbar ────────────────────────────────────────────────────────────
          flex-shrink-0 → never squished by the growing content below
          No sticky/position needed because the outer shell clips overflow;
          the toolbar naturally stays at the top.
        */}
        <div className="flex-shrink-0 bg-green-400 dark:bg-gray-700 border-b border-green-300 dark:border-gray-600 rounded-t-2xl">
          <ToolBar />
        </div>

        {/*
          ── Scroll container ───────────────────────────────────────────────────
          THIS is the element that scrolls — not ContentEditable.
          
          • flex-1        → fills all remaining height after the toolbar
          • overflow-y-auto → shows a scrollbar when content exceeds height
          • relative      → REQUIRED: Lexical renders the placeholder with
                            `position: absolute`, so it needs a positioned
                            ancestor or it escapes to a random parent.
        */}
        <div className="relative flex-1 overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="
                  bg-white dark:bg-[#1E293B]
                  text-gray-900 dark:text-gray-100
                  outline-none
                  p-4 w-full
                  min-h-full
                "
                /*
                  min-h-full makes the editable at least as tall as the scroll
                  container so clicking anywhere in the empty space focuses it.
                  Do NOT add overflow-y-auto here — Lexical ignores it and it
                  breaks the scroll chain.
                */
              />
            }
            placeholder={
              /*
                top-4 left-4 aligns with the p-4 padding on ContentEditable.
                Anchors to the `relative` scroll wrapper above.
              */
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
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