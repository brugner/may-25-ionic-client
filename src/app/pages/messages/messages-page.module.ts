import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ChatPage } from './chat/chat.page';
import { MessagesPageRoutingModule } from './messages-page-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessagesPageRoutingModule
    ],
    exports: [

    ],
    declarations: [
        ChatPage
    ],
    providers: [
        UserService
    ],
})
export class MessagesPageModule {

}
