// src/components/Toolbar.jsx
import {
  FaBold,
  FaUnderline,
  FaItalic,
  FaSubscript,
  FaHeading,
} from "react-icons/fa6";
import { FaUndo, FaRedo } from "react-icons/fa";
import {
  MdFormatListBulletedAdd,
  MdSuperscript,
  MdFormatListNumberedRtl,
  MdOutlinePlaylistRemove,
} from "react-icons/md";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $isRangeSelection, $getSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import INSERT_HEADING_COMMAND from "../commands/headingCommand";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className=" grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <button
        type="button"
        className="py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <FaBold className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <FaUnderline className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-blue-500 hover:text-white dark:bg-blue-500 dark:text-white"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }
          });
        }}
      >
        <MdFormatListBulletedAdd className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-blue-500 hover:text-white dark:bg-blue-500 dark:text-white"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
          });
        }}
      >
        <MdFormatListNumberedRtl className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-red-500 hover:text-white dark:bg-red-500 dark:text-white"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }
          });
        }}
      >
        <MdOutlinePlaylistRemove className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <FaItalic className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
      >
        <FaSubscript className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
        }
      >
        <MdSuperscript className="inline text-2xl" />
      </button>
      <select
        name="heading"
        id="heading"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onChange={(e) => {
          const level = e.target.value;
          if (level) {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(level));
              }
            });
          }
        }}
      >
        <option value="">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
      >
        <FaUndo className="inline text-2xl" />
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-green-500 hover:text-white dark:bg-green-500 dark:text-white"
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
      >
        <FaRedo className="inline text-2xl" />
      </button>
    </div>
  );
};

export default Toolbar;
