export default class GeoHelper {

    /**
     * Returns true if the distance between two points is less than the specified.
     * @param lat1 point 1 latitude.
     * @param lng1 point 1 longitude.
     * @param lat2 point 2 latitude.
     * @param lng2 point 1 longitude.
     * @param distance distance in meters.
     */
    public static arePointsNear(lat1: number, lng1: number, lat2: number, lng2: number, distance: number = 10000): boolean {
        return this.getDistanceBetweenPoints(lat1, lng1, lat2, lng2) < distance;
    }

    /**
     * Returns the distance in meters between two points.
     * @param lat1 point 1 latitude.
     * @param lng1 point 1 longitude.
     * @param lat2 point 2 latitude.
     * @param lng2 point 1 longitude.
     */
    private static getDistanceBetweenPoints(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const earthRadius = 6371; // In km

        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c * 1000;
    }

    private static degToRad(deg: number) {
        return deg * (Math.PI / 180);
    }
}
