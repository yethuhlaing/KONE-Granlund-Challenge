export const DEFAULTDATABASE = 'moto_database.db'
export const keyIconMap: { [key: string]: string } = {
    equipmentName: 'wrench',               // represents equipment
    location: 'location-arrow',           // for location
    manufacturer: 'industry',             // represents manufacturing
    model: 'barcode',                     // represents model or serial data
    serialNumber: 'id-badge',             // represents ID or serial numbers
    equipmentType: 'cogs',                // represents machinery or equipment type
    size: 'expand',               // represents size or measurements
    age: 'hourglass-half',                // represents time or age
    material: 'cube',                     // represents material
    condition: 'heartbeat',               // represents condition or health
    surveyorComments: 'comments',     // represents comments or feedback
    guid: 'key',
};

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
    light: {
        text: '#000',
        background: '#fff',
        tint: tintColorLight,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#fff',
        background: '#000',
        tint: tintColorDark,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorDark,
    },
};
