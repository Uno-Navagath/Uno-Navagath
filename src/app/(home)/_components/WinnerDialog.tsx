import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";


export function WinnerDialog({winner, onClose}: {winner: string | null, onClose: () => void}) {
    return (
    <Dialog open={!!winner} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                    🏆 {winner} Wins!
                </DialogTitle>
                <DialogDescription className="text-lg mt-2">
                    Congratulations! 🎉
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
                <p className="text-muted-foreground">
                    Thanks for playing — ready for the next match?
                </p>
            </div>
        </DialogContent>
    </Dialog>
)
    ;
}
