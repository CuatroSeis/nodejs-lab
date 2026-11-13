"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import type { CodeEditorProps } from "../types/editor";

export default function CodeEditor({
  value,
  language = "javascript",
  readOnly = false,
  onChange,
  height = "400px",
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isExternalChange = useRef(false);

  // Crear o actualizar el editor
  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      basicSetup,
      readOnly ? EditorView.editable.of(false) : EditorView.editable.of(true),
      javascript(),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange && !isExternalChange.current) {
          onChange(update.state.doc.toString());
        }
        isExternalChange.current = false;
      }),
      EditorView.lineWrapping,
    ];

    if (!viewRef.current) {
      const state = EditorState.create({
        doc: value,
        extensions,
      });
      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    } else {
      // Solo actualizar si el valor externo difiere del interno para preservar cursor/selección
      const currentDoc = viewRef.current.state.doc.toString();
      if (currentDoc !== value) {
        isExternalChange.current = true;
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentDoc.length,
            insert: value,
          },
        });
      }
    }

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [value, readOnly, onChange, height, language]);

  const focus = useCallback(() => {
    viewRef.current?.focus();
  }, []);

  return (
    <div
      ref={editorRef}
      className="code-editor-container"
      style={{ height }}
    />
  );
}
