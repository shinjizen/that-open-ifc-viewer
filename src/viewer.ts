import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

const container = document.getElementById("container") as HTMLDivElement;

const components = new OBC.Components(); // create instance for components

// create world from components instance
const worlds = components.get(OBC.Worlds);
const world = worlds.create<
    OBC.SimpleScene,
    OBC.OrthoPerspectiveCamera,
    OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

world.scene.setup();

// Grid
const grids = components.get(OBC.Grids);
grids.create(world);

world.scene.three.background = null;

// Loader IFC w/ Fragment
const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

// WASM Setup
await fragmentIfcLoader.setup();

fragmentIfcLoader.settings.wasm = {
    path: "https://unpkg.com/web-ifc@0.0.57/",
    absolute: true,
};

const excludedCategories = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT
];

for (const category of excludedCategories) {
    fragmentIfcLoader.settings.excludedCategories.add(category);
}

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

const pathParts = window.location.pathname.split('/');
const fileName = pathParts[pathParts.length - 1]; 

if (fileName) {
    loadIfc(fileName);
} else {
    console.error('Filename tidak ditemukan dalam URL.');
}

async function loadIfc(filename: String) {
    const fileUrl = `http://localhost:3000/get/ifc/${filename}`;
    const response = await fetch(fileUrl);

    if (!response.ok) {
        throw new Error('Gagal memuat file IFC: ' + response.statusText);
    }

    const data = await response.arrayBuffer();
    const buffer = new Uint8Array(data);
    
    const model = await fragmentIfcLoader.load(buffer);
    world.scene.three.add(model);
}

fragments.onFragmentsLoaded.add((model) => {
    console.log(model);
});