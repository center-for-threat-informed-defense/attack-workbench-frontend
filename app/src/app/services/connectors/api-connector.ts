import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, of } from "rxjs";

export abstract class ApiConnector {
    private theSnackbar: MatSnackBar; //note: constructor in super must import snackbar
    constructor(snackbar: MatSnackBar) { this.theSnackbar = snackbar; }

    protected handleError_single<T>() {
        return (error: any): Observable<T> => {
            console.error(error);
            this.snack(error.error, "warn");
            return new Observable<T>();
        }
    }

    protected handleError_array<T>(defaultValue?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this.snack(error.error, "warn");
            return of(defaultValue as T);
        }
    }

    protected handleSuccess(message: string = "success") {
        return (success: any) => {
            console.log(success);
            this.snack(message, "success");
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