import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPage } from './chat/chat.page';

const routes: Routes = [
    {
        path: '',
        component: ChatPage
    },
    {
        path: 'trip/:tripId/:user1/:user2',
        component: ChatPage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MessagesPageRoutingModule {

}
