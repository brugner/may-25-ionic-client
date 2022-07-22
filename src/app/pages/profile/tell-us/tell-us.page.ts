import { ToastService } from 'src/app/services/toast.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserForUpdate } from 'src/app/models/users/user-for-update.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-tell-us',
    templateUrl: 'tell-us.page.html'
})
export class TellUsPage implements OnInit {

    moment: any = moment;
    maxBirthdayDate: string = moment().format();
    profileForm: FormGroup;
    cards: boolean[] = [true, false, false];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private toastService: ToastService) {

    }

    ngOnInit(): void {
        this.buildProfileForm();
    }

    moveToCard(cardIndex: number): void {
        for (let index = 0; index < this.cards.length; index++) {
            this.cards[index] = false;
        }

        this.cards[cardIndex] = true;
    }

    done(): void {
        const user = this.getUserProfileFromForm();

        this.userService.updateUser(user)
            .subscribe(() => {
                this.cleanForm();
                this.toastService.present('success', 'Perfil actualizado');
                this.router.navigate(['tabs/search']);
            });
    }

    private getUserProfileFromForm(): UserForUpdate {
        const user = new UserForUpdate();

        if (this.firstName.value !== '') {
            user.firstName = this.firstName.value;
        }

        if (this.lastName.value !== '') {
            user.lastName = this.lastName.value;
        }

        if (this.birthday.value !== '') {
            user.birthday = this.birthday.value;
        }

        if (this.gender.value !== '') {
            user.gender = this.gender.value;
        }

        if (this.bio.value !== '') {
            user.bio = this.bio.value;
        }

        user.talk = Number.parseInt(this.talk.value, 10);
        user.music = Number.parseInt(this.music.value, 10);
        user.smoking = Number.parseInt(this.smoking.value, 10);
        user.pets = Number.parseInt(this.pets.value, 10);

        return user;
    }

    private buildProfileForm(): void {
        this.profileForm = this.formBuilder.group({
            firstName: [''],
            lastName: [''],
            birthday: [''],
            gender: [''],
            bio: [''],
            talk: ['5'],
            music: ['5'],
            smoking: ['5'],
            pets: ['5'],
        });
    }

    private cleanForm(): void {
        this.firstName.setValue('');
        this.lastName.setValue('');
        this.birthday.setValue(this.maxBirthdayDate);
        this.gender.setValue('F');
        this.bio.setValue('');
        this.talk.setValue('5');
        this.music.setValue('5');
        this.smoking.setValue('5');
        this.pets.setValue('5');
    }

    get firstName() {
        return this.profileForm.get('firstName');
    }

    get lastName() {
        return this.profileForm.get('lastName');
    }

    get birthday() {
        return this.profileForm.get('birthday');
    }

    get gender() {
        return this.profileForm.get('gender');
    }

    get bio() {
        return this.profileForm.get('bio');
    }

    get talk() {
        return this.profileForm.get('talk');
    }

    get music() {
        return this.profileForm.get('music');
    }

    get smoking() {
        return this.profileForm.get('smoking');
    }

    get pets() {
        return this.profileForm.get('pets');
    }
}
