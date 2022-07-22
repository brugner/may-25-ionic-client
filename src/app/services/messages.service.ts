import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/messages/message.model';
import { MessageForCreation } from '../models/messages/message-for-creation.model';

@Injectable({ providedIn: 'root' })
export class MessagesService {

    constructor(private http: HttpClient) {

    }

    getAll(tripId: number, user1: number, user2: number): Observable<Message[]> {
        return this.http.get<Message[]>(`messages/trip/${tripId}/${user1}/${user2}`);
    }

    send(message: MessageForCreation): Observable<Message> {
        return this.http.post<Message>('messages', message);
    }
}
