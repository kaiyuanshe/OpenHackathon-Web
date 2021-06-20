const key = 'f2d1df02fc1c58d8a4ed23bfc0b584bd';

async function requestAMap<T = {}>(path: string, data: any): Promise<T> {
    const response = await fetch(
        `//restapi.amap.com/v3/${path}?${new URLSearchParams({ ...data, key })}`
    );
    const { status, info, ...rest } = await response.json();

    if (status !== '1') throw new URIError(info);

    return rest;
}

interface GeoCode {
    location: string;
    province: string;
    city: string;
    district: string;
    street: string;
    number: string;
}

export interface Coord {
    latitude: number;
    longitude: number;
    province: string;
    city: string;
    district: string;
    address: string;
}

export async function coordsOf(address: string): Promise<Coord[]> {
    const { geocodes } = await requestAMap<{ geocodes: GeoCode[] }>(
        'geocode/geo',
        { address }
    );

    return geocodes.map(
        ({ location, province, city, district, street, number }) => {
            const [longitude, latitude] = location.split(',').map(Number);

            return {
                latitude,
                longitude,
                province,
                city,
                district,
                address: street + number
            };
        }
    );
}
