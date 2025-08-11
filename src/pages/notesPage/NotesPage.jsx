import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, ListOrdered, Trash2, Pencil } from "lucide-react";
import NoteItem from "@/components/notes/NoteItem";
import UserFooter from "@/components/notes/UserFooter";

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      title: "LIST DATA",
      content: "iam here , and i want go to the zoo",
      lastEdited: "2025-08-03 14:15:44",
    },
    {
      title: "TO DO LIST",
      content:
        '-Set an appointment for Patient "Jacob Smith"\n-Pay Electrical bills\n-Pay Prosthetic lab bills',
      lastEdited: "2025-06-25 11:28:55",
    },
    {
      title: "SHOPPING LIST",
      content: "",
      lastEdited: "2025-06-25 11:27:56",
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [noteIndexBeingEdited, setNoteIndexBeingEdited] = useState(null);

  const openEditDialog = (index) => {
    setEditMode(true);
    setNoteIndexBeingEdited(index);
    setNewTitle(notes[index].title);
    setNewContent(notes[index].content);
  };

  const handleAddOrEditNote = () => {
    if (!newTitle.trim()) return;

    const updatedNote = {
      title: newTitle,
      content: newContent,
      lastEdited: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    if (editMode && noteIndexBeingEdited !== null) {
      const updatedNotes = [...notes];
      updatedNotes[noteIndexBeingEdited] = updatedNote;
      setNotes(updatedNotes);
    } else {
      setNotes([...notes, updatedNote]);
    }

    // Reset states
    setNewTitle("");
    setNewContent("");
    setEditMode(false);
    setNoteIndexBeingEdited(null);
  };

  const handleDeleteNote = (index) => {
    const filtered = notes.filter((_, i) => i !== index);
    setNotes(filtered);
  };

  return (
    <div className="py-6 bg-gray-200 text-black min-h-screen">
      <h1 className="text-center text-3xl text-black font-bold mb-6">NOTES</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Notes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notes.map((note, i) => (
            <NoteItem 
                key={i}
                noteItem={note}
                i={i}
                openEditDialog={openEditDialog}
                handleDeleteNote={handleDeleteNote}
            />
          ))}
        </div>

        {/* Index Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-24 right-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
            >
              <ListOrdered />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black w-80">
            <h3 className="text-lg font-bold mb-2 text-center">INDEX</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notes.map((note, i) => (
                <div
                  key={i}
                  className="bg-secondary px-3 py-2 rounded shadow border"
                >
                  <p className="font-semibold">
                    {i + 1}. {note.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    Last Edited: {note.lastEdited}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add/Edit Note Dialog */}
      <Dialog open={editMode || undefined} onOpenChange={(open) => !open && setEditMode(false)}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
          >
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white text-black w-[90vw] max-w-md">
          <h2 className="text-lg font-bold mb-4">
            {editMode ? "Edit Note" : "Add New Note"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <textarea
            placeholder="Details"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded h-32"
          />
          <Button
            onClick={handleAddOrEditNote}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {editMode ? "Update Note" : "Save Note"}
          </Button>
        </DialogContent>
      </Dialog>
      
      {/* User Footer */}
      <UserFooter />
    </div>
  );
}
