import React, { createContext, useReducer, useContext, useEffect, ReactNode } from "react";

import { EDITOR_STATE_LOCAL_STORAGE_KEY, SAVE_PAGE_TIMEOUT } from "@/lib/utils";

import { findBlock } from "@/components/editor/preview/editor-blocks-reducer";
import {
  EditorPreviewState,
  initialEditorPreviewState,
} from "@/components/editor/preview/editor-preview-provider";
import { EditorThemeState } from "@/components/editor/preview/editor-theme-reducer";
import { Block } from "@/lib/editor/blocks";
import { Page } from "@/lib/editor/pages";
import { useUpdatePage } from "@/lib/hooks/pages/use-update-page";
import { useUpdateProject } from "@/lib/hooks/projects/use-update-project";
import { ProjectWithPages } from "@/lib/supabase/types";

interface EditorContextValue extends EditorPreviewState {
  selectedBlock?: Block;
}

const EditorContext = createContext<EditorContextValue>(initialState);

interface EditorProviderProps {
  project: ProjectWithPages | null;
  children: ReactNode;
}

export function EditorProvider({ project, children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const { mutate: updatePage } = useUpdatePage();
  const { mutate: updateProject } = useUpdateProject();

  /* Listen for messages from iframe window and dispatch them */
  useEffect(() => {
    let savePageTimeout: NodeJS.Timeout;
    let saveProjectTimeout: NodeJS.Timeout;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const isEditorActionType = (type: any): type is EditorActionType => {
        return Object.values(EditorActionType).includes(type);
      };

      const message = event.data;

      if (isEditorActionType(message.type)) {
        dispatch(message);
      }

      /* Save page or project */
      if (isSaveAction(message)) {
        if (project) {
          if (message.type === SaveActionType.SAVE_PAGE) {
            clearTimeout(savePageTimeout);

            savePageTimeout = setTimeout(() => {
              updatePage({
                pageId: Number(message.page.id),
                blocks: message.page.blocks as any,
              });
            }, SAVE_PAGE_TIMEOUT);
          }

          if (message.type === SaveActionType.SAVE_THEME) {
            clearTimeout(saveProjectTimeout);

            saveProjectTimeout = setTimeout(() => {
              updateProject({
                projectId: project.id,
                theme: message.theme as any,
              });
            }, SAVE_PAGE_TIMEOUT);
          }
        }

        if (message.type === SaveActionType.SAVE_STATE_LOCALLY) {
          const localStorageId = project ? project.id : "local";

          localStorage.setItem(
            `${EDITOR_STATE_LOCAL_STORAGE_KEY}-${localStorageId}`,
            JSON.stringify(message.state),
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearTimeout(savePageTimeout);
      clearTimeout(saveProjectTimeout);
      window.removeEventListener("message", handleMessage);
    };
  }, [project, updatePage, updateProject]);

  const { pages, selectedBlockId } = state;
  const blocks = pages[0].blocks;

  const selectedBlock = selectedBlockId ? findBlock(blocks, selectedBlockId) : undefined;

  return (
    <EditorContext.Provider
      value={{
        ...state,
        selectedBlock,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const editorContext = useContext(EditorContext);
  if (!editorContext) {
    throw new Error("Editor context is undefined");
  }
  return editorContext;
}
