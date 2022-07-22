export class Notification {
    id: number;
    generatorUserId: number;
    targetUserId: number;
    title: string;
    body: string;
    refId?: number;
    type: number;
    read: boolean;
    createdAt: string;
}
