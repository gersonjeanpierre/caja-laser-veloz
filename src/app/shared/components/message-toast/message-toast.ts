import { Component, inject, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-message-toast',
  templateUrl: './message-toast.html',
  styleUrl: './message-toast.css',
  imports: [ToastModule],
  providers: [MessageService],
})
export class MessageToast {
  private messageService = inject(MessageService);


  @Input() severity: 'success' | 'info' | 'warn' | 'error' = 'info';
  @Input() summary: string = '';
  @Input() detail: string = '';
  @Input() life: number = 4000;
  @Input() sticky: boolean = false;
  @Input() position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom-center" = "top-right";

  show() {
    this.messageService.add({
      severity: this.severity,
      summary: this.summary,
      detail: this.detail,
      life: this.life,
      sticky: this.sticky,
    })
  }

  clear() {
    this.messageService.clear();
  }
}