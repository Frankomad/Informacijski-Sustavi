import { useState } from "react";
import { useRiskTypes } from "@/hooks/useRiskTypes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function RiskTypeManager() {
  const { riskTypes, createRiskType, deleteRiskType, editRiskType, isLoading } = useRiskTypes();
  const [newRiskType, setNewRiskType] = useState({ name: "", description: "", color: "" });
  const [editModal, setEditModal] = useState<{ open: boolean; id: string | null; data: any }>({ open: false, id: null, data: {} });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRiskType.mutate(newRiskType);
    setNewRiskType({ name: "", description: "", color: "" });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal.id) {
      editRiskType.mutate({ id: editModal.id, data: editModal.data });
      setEditModal({ open: false, id: null, data: {} });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Risk Types</h2>
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Name"
          value={newRiskType.name}
          onChange={e => setNewRiskType({ ...newRiskType, name: e.target.value })}
          required
        />
        <Input
          placeholder="Description"
          value={newRiskType.description}
          onChange={e => setNewRiskType({ ...newRiskType, description: e.target.value })}
        />
        <Input
          placeholder="Color (hex or name)"
          value={newRiskType.color}
          onChange={e => setNewRiskType({ ...newRiskType, color: e.target.value })}
        />
        <Button type="submit" disabled={createRiskType.isLoading}>Add</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {riskTypes.map(rt => (
            <TableRow key={rt.id}>
              <TableCell>{rt.name}</TableCell>
              <TableCell>{rt.description}</TableCell>
              <TableCell>
                <span style={{ background: rt.color, padding: "0.25em 0.75em", borderRadius: 4, color: "#fff" }}>{rt.color}</span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => setEditModal({ open: true, id: rt.id, data: { name: rt.name, description: rt.description, color: rt.color } })}>Edit</Button>
                <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteRiskType.mutate(rt.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={editModal.open} onOpenChange={open => setEditModal(v => ({ ...v, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Risk Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <Input
              placeholder="Name"
              value={editModal.data.name || ""}
              onChange={e => setEditModal(v => ({ ...v, data: { ...v.data, name: e.target.value } }))}
              required
            />
            <Input
              placeholder="Description"
              value={editModal.data.description || ""}
              onChange={e => setEditModal(v => ({ ...v, data: { ...v.data, description: e.target.value } }))}
            />
            <Input
              placeholder="Color (hex or name)"
              value={editModal.data.color || ""}
              onChange={e => setEditModal(v => ({ ...v, data: { ...v.data, color: e.target.value } }))}
            />
            <DialogFooter>
              <Button type="submit" disabled={editRiskType.isLoading}>Save</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 