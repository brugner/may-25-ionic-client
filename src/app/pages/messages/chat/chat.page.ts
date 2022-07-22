import { MessageForCreation } from './../../../models/messages/message-for-creation.model';
import { AuthService } from './../../../services/auth.service';
import { LoadingService } from './../../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from 'src/app/models/messages/message.model';
import * as moment from 'moment';
import 'moment/locale/es';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-chat',
    templateUrl: 'chat.page.html',
    styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit {

    messages: Message[] = [];
    moment: any = moment;
    messageForm: FormGroup;
    tripId: number;
    user1: number;
    user2: number;

    @ViewChild('content') private content: any;

    constructor(
        private route: ActivatedRoute,
        private loadingService: LoadingService,
        private messagesService: MessagesService,
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {

    }

    ngOnInit(): void {

        this.buildMessageForm();

        this.route.queryParams.subscribe(() => {

            this.loadingService.present();
            this.loadMessages();
        });
    }

    ionViewDidEnter() {
        this.content.scrollToBottom(300);
    }

    doRefresh(event: any): void {
        this.loadMessages();
        event.target.complete();
    }

    authUserIsSender(fromUserId: number): boolean {
        return fromUserId === this.authService.user.id;
    }

    send(): void {
        if (this.messageForm.invalid) {
            return;
        }

        const messageForCreation = new MessageForCreation();
        messageForCreation.tripId = this.tripId;
        messageForCreation.toUserId = this.authService.user.id === this.user1 ? this.user2 : this.user1;
        messageForCreation.text = this.messageForm.get('text').value;

        this.messagesService.send(messageForCreation)
            .subscribe(message => {
                this.messageForm.get('text').setValue('');
                this.messages.push(message);
            });
    }

    private loadMessages(): void {
        this.tripId = Number.parseInt(this.route.snapshot.paramMap.get('tripId'), 10);
        this.user1 = Number.parseInt(this.route.snapshot.paramMap.get('user1'), 10);
        this.user2 = Number.parseInt(this.route.snapshot.paramMap.get('user2'), 10);

        this.messagesService.getAll(this.tripId, this.user1, this.user2)
            .subscribe(result => {
                this.loadingService.dismiss();
                this.messages = result;
            });
    }

    private buildMessageForm(): void {
        this.messageForm = this.formBuilder.group({
            text: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]]
        });
    }
}
