import { useAtom } from "jotai";

import { Button } from "@/components/ui/button";
import { BaseDialogProps, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isDerivedAccountEnabledAtom } from "@/lib/settings";

export function SettingsModal({ open, onOpenChange }: BaseDialogProps) {
  const [isDerivedAccountEnabled, setIsDerivedAccountEnabled] = useAtom(
    isDerivedAccountEnabledAtom,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
      }}
      modal={true}
    >
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col px-6">
        <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>

        <div className="flex items-center space-x-2">
          <Switch
            checked={isDerivedAccountEnabled}
            onCheckedChange={(checked) => {
              setIsDerivedAccountEnabled(checked);
            }}
            id="derived-account"
          />
          <Label htmlFor="derived-account">Derived Account</Label>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            // disabled={isPending}
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            // disabled={isPending}
            // loading={isPending}
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
