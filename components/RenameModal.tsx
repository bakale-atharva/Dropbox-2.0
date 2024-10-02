"use client";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";

export function RenameModal() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen, fileId, filename] =
    useAppStore((state) => [
      state.isRenameModalOpen,
      state.setIsRenameModalOpen,
      state.fileId,
      state.filename,
    ]);

  const renameFile = async () => {
    if (!user || !fileId) return;

    const toastId = toast.loading("Renaming...");

    await updateDoc(doc(db, "users", user.id, "files", fileId), {
      filename: input,
    });

    toast.success("Renamed Successfully", {
      id: toastId,
    });

    setInput("");
    setIsRenameModalOpen(false);
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-2">Rename The File</DialogTitle>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                defaultValue={filename}
                onChange={(e) => setInput(e.target.value)}
                onKeyDownCapture={(e) => {
                  if (e.key === "Enter") {
                    renameFile();
                  }
                }}
                className="bg-gray-700 text-white rounded p-2 my-4"
              />
            </div>

            <div className="flex justify-end space-x-2 py-3">
              <Button
                size="sm"
                className="px-3"
                variant={"ghost"}
                onClick={() => setIsRenameModalOpen(false)}
              >
                <span className="sr-only">Cancel</span>
                <span>Cancel</span>
              </Button>

              <Button
                type="submit"
                size="sm"
                className="px-3"
                onClick={() => renameFile()}
              >
                <span className="sr-only">Rename</span>
                <span>Rename</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
