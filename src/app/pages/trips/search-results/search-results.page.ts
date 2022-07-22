import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripSummary } from 'src/app/models/trips/trip-summary.model';

@Component({
    selector: 'app-search-results',
    templateUrl: 'search-results.page.html'
})
export class SearchResultsPage implements OnInit {

    searchResults: TripSummary[] = [];
    searchResultTitle: string;
    searchResultSubtitle: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                const state = this.router.getCurrentNavigation().extras.state;
                this.searchResults = state.searchResults;

                if (this.searchResults.length === 0) {
                    this.searchResultTitle = 'No encontramos ningún viaje';
                    this.searchResultSubtitle = 'No pasa nada, ya va a aparecer alguno. Mientras puedes crear una alerta que te avisará cuando haya un viaje disponible.';
                }

                if (this.searchResults.length === 1) {
                    this.searchResultTitle = 'Encontramos un solo viaje';
                    this.searchResultSubtitle = 'Mira este viaje y si no te convence puedes crear una alerta que te avisará cuando haya más viajes disponibles.';
                }

                if (this.searchResults.length > 1) {
                    this.searchResultTitle = 'Encontramos ' + this.searchResults.length + ' viajes';
                    this.searchResultSubtitle = '¡Buenísimo! Elige el que más te guste y ponte en contacto con el conductor para empezar.';
                }
            }
        });
    }
}
