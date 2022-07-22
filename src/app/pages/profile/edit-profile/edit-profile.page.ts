import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserForUpdate } from 'src/app/models/users/user-for-update.model';
import { LoadingService } from 'src/app/services/loading.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ToastService } from 'src/app/services/toast.service';
import * as moment from 'moment';
import 'moment/locale/es';
import { ActionSheetController } from '@ionic/angular';
import { User } from 'src/app/models/users/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss']
})
export class EditProfilePage implements OnInit, OnDestroy {

  user: User;
  subscription: Subscription;

  moment: any = moment;
  profilePicture: string = environment.defaultProfilePicture;
  profileForm: FormGroup;
  maxBirthdayDate: string = moment().format();

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    public photoService: PhotoService,
    private userService: UserService,
    private actionsheetCtrl: ActionSheetController) {

  }

  ngOnInit(): void {
    this.buildProfileForm();
    this.loadingService.present();

    this.subscription = this.userService.user$
      .subscribe(result => {
        this.user = result;
        this.setProfileForm(result);
        this.loadingService.dismiss();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  doRefresh(event: any): void {
    this.userService.getAuthenticatedUser(true)
      .subscribe(
        () => event.target.complete(),
        () => event.target.complete());
  }

  updateProfile(): void {
    if (!this.profileForm.valid) {
      this.toastService.present('danger', 'Completa todos los campos');
      return;
    }

    this.loadingService.present();
    const user = this.getUserProfileFromForm();

    this.userService.updateUser(user)
      .subscribe(async result => {
        this.loadingService.dismiss();
        this.user = result;
        this.toastService.present('success', 'Perfil actualizado');
      });
  }

  async takePhoto(): Promise<void> {
    const actionSheet = await this.actionsheetCtrl.create({
      buttons: [
        {
          text: 'Cámara',
          role: 'destructive',
          handler: async () => {
            await this.photoService.takePhotoWithCamera()
              .then(result => {
                if (result !== undefined) {
                  this.profilePicture = result.base64;
                  this.user.picture = result.base64;
                }
              });
          }
        },
        {
          text: 'Galería',
          handler: async () => {
            await this.photoService.takePhotoFromGallery()
              .then(result => {
                if (result !== undefined) {
                  this.profilePicture = result.base64;
                  this.user.picture = result.base64;
                }
              });
          }
        },
      ]
    });

    await actionSheet.present();
  }

  private getUserProfileFromForm(): UserForUpdate {
    const user = new UserForUpdate();
    user.picture = this.user.picture;
    user.firstName = this.firstName.value;
    user.lastName = this.lastName.value;
    user.birthday = this.birthday.value;
    user.gender = this.gender.value;
    user.bio = this.bio.value;
    user.talk = Number.parseInt(this.talk.value, 10);
    user.music = Number.parseInt(this.music.value, 10);
    user.smoking = Number.parseInt(this.smoking.value, 10);
    user.pets = Number.parseInt(this.pets.value, 10);

    return user;
  }

  private buildProfileForm(): void {
    this.profileForm = this.formBuilder.group({
      email: new FormControl({ value: '', disabled: true }),
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(300)]],
      talk: ['', Validators.required],
      music: ['', Validators.required],
      smoking: ['', Validators.required],
      pets: ['', Validators.required],
    });
  }

  private setProfileForm(userProfile: User): void {
    this.profilePicture = userProfile.picture || environment.defaultProfilePicture;
    this.email.setValue(userProfile.email);

    this.firstName.setValue(userProfile.firstName);
    this.lastName.setValue(userProfile.lastName);
    this.birthday.setValue(userProfile.birthday);
    this.gender.setValue(userProfile.gender);
    this.bio.setValue(userProfile.bio);
    this.talk.setValue(userProfile.talk);
    this.music.setValue(userProfile.music);
    this.smoking.setValue(userProfile.smoking);
    this.pets.setValue(userProfile.pets);
  }

  get email() {
    return this.profileForm.get('email');
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
