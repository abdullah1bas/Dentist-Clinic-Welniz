import React from "react";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function NoteItem({ noteItem, i, openEditDialog, handleDeleteNote }) {
  return (
    <div className="rounded-lg shadow relative text-black flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 bg-background text-white rounded-t-lg">
        <h2 className="font-bold text-sm sm:text-lg">{noteItem.title}</h2>
        <div className="flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openEditDialog(i)}
            className="hover:bg-hover-icon hover:text-white"
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDeleteNote(i);
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                  });
                }
              });
            }}
            className="hover:bg-hover-icon hover:text-white"
          >
            <Trash2 className="size-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white my-auto px-4 py-3 rounded-b-lg">
        <pre className="whitespace-pre-wrap text-xs sm:text-sm mb-auto">{noteItem.content}</pre>
        <p className="text-xs text-gray-500 text-right mt-2">
          Last Edited: {noteItem.lastEdited}
        </p>
      </div>
    </div>
  );
}

export default NoteItem;
