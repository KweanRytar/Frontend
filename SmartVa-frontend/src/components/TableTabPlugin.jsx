import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_TAB_COMMAND,
  $createParagraphNode,
} from 'lexical';
import {
  TableCellNode,
  TableRowNode,
  $getTableCellNodeFromLexicalNode,
  $insertTableRowAtSelection,
} from '@lexical/table';

const TableTabPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        const cell = $getTableCellNodeFromLexicalNode(anchorNode);

        if (!cell) return false;

        editor.update(() => {
          const parentRow = cell.getParent();
          const table = parentRow?.getParent();

          if (!(parentRow instanceof TableRowNode) || !table) return;

          const rowIndex = table.getChildren().indexOf(parentRow);
          const cellIndex = parentRow.getChildren().indexOf(cell);

          const isLastRow = rowIndex === table.getChildrenSize() - 1;
          const isLastCell = cellIndex === parentRow.getChildrenSize() - 1;

          if (isLastRow && isLastCell) {
            // Insert new row
            $insertTableRowAtSelection(true);

            // Ensure new row has paragraphs
            const newRow = table.getChildAtIndex(rowIndex + 1);
            if (newRow instanceof TableRowNode) {
              newRow.getChildren().forEach((newCell) => {
                if (newCell instanceof TableCellNode && newCell.getChildrenSize() === 0) {
                  newCell.append($createParagraphNode());
                }
              });

              // Move cursor to first cell
              const firstCell = newRow.getFirstChild();
              const newSelection = firstCell?.getFirstDescendant()?.selectStart();
              newSelection?.select();
            }
          } else {
            // Move to next cell
            const nextCell = cell.getNextSibling() || parentRow.getNextSibling()?.getFirstChild();
            const newSelection = nextCell?.getFirstDescendant()?.selectStart();
            newSelection?.select();
          }
        });

        event.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
};

export default TableTabPlugin;