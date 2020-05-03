import { Component } from "@angular/core";
import { SearchService } from "./search.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private search: SearchService) {}
  call_method() {
    this.search.method_service(true);
  }
}
