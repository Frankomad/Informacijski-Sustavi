import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PortfolioFormProps {
  onSubmit: (data: { naziv: string; strategija: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialValues?: { naziv: string; strategija: string };
}

const PortfolioForm = ({ onSubmit, onCancel, isLoading, initialValues }: PortfolioFormProps) => {
  const [naziv, setNaziv] = useState(initialValues?.naziv || "");
  const [strategija, setStrategija] = useState(initialValues?.strategija || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (naziv.trim()) {
      onSubmit({ naziv: naziv.trim(), strategija: strategija.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="naziv">Portfolio Name *</Label>
        <Input
          id="naziv"
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
          placeholder="Enter portfolio name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="strategija">Strategy</Label>
        <Input
          id="strategija"
          value={strategija}
          onChange={(e) => setStrategija(e.target.value)}
          placeholder="Enter investment strategy"
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || !naziv.trim()}>
          {isLoading ? (initialValues ? "Saving..." : "Creating...") : initialValues ? "Save Changes" : "Create Portfolio"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PortfolioForm;
