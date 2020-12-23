import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, of } from "rxjs";

export abstract class ApiConnector {
    private theSnackbar: MatSnackBar; //note: constructor in super must import snackbar
    constructor(snackbar: MatSnackBar) { this.theSnackbar = snackbar; }

    protected handleError<T>() {
        return (error: any): Observable<T> => {
            console.error(error);
            this.snack(error.statusText, "warn");
            return new Observable<T>();
        }
    }
    protected handleSuccess() {
        return (success: any) => {
            console.log(success);
            this.snack(success.statusText, "success");
        }
    }

    /**
     * Show a snackbar
     * @param {string} message the message to show
     * @param {("warn" | "success")} [snackType] formatting of the snackbart
     */
    private snack(message: string, snackType?: "warn" | "success"): void {
        this.theSnackbar.open(message, "dismiss", {
            duration: 2000,
            panelClass: snackType
        })
    }

}