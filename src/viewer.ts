import * as BUI from "@thatopen/ui";
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

// Stats (optional)
// const stats = new Stats();
// stats.showPanel(12);
// document.body.append(stats.dom);
// stats.dom.style.left = "0px";
// stats.dom.style.zIndex = "unset";
// world.renderer.onBeforeUpdate.add(() => stats.begin());
// world.renderer.onAfterUpdate.add(() => stats.end());

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
    const buffer = new Uint8Array(data); // Ubah ke Uint8Array

    // Muat model IFC
    const model = await fragmentIfcLoader.load(buffer);
    world.scene.three.add(model);
}

fragments.onFragmentsLoaded.add((model) => {
    console.log(model);
});

function download(file: File) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

async function exportFragments() {
    if (!fragments.groups.size) {
        return;
    }
    const group = Array.from(fragments.groups.values())[0];
    const data = fragments.export(group);
    download(new File([new Blob([data])], "small.frag"));

    const properties = group.getLocalProperties();
    if (properties) {
        download(new File([JSON.stringify(properties)], "small.json"));
    }
}

function disposeFragments() {
    fragments.dispose();
}

// UI
BUI.Manager.init();

// const panel = BUI.Component.create<BUI.PanelSection>(() => {
//     return BUI.html`
//     <bim-panel active label="IFC Loader Tutorial" class="options-menu">
//       <bim-panel-section collapsed label="Controls">
//         <bim-panel-section style="padding-top: 12px; ">
        
//           <bim-button label="Load IFC"
//             @click="${() => {
//               loadIfc();
//             }}">
//           </bim-button>  
              
//           <bim-button label="Export fragments"
//             @click="${() => {
//               exportFragments();
//             }}">
//           </bim-button>  
              
//           <bim-button label="Dispose fragments"
//             @click="${() => {
//               disposeFragments();
//             }}">
//           </bim-button>
        
//         </bim-panel-section>
        
//       </bim-panel>
//     `;
//   });
  
//   document.body.append(panel);
  
//   const button = BUI.Component.create<BUI.PanelSection>(() => {
//     return BUI.html`
//         <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
//           @click="${() => {
//             if (panel.classList.contains("options-menu-visible")) {
//               panel.classList.remove("options-menu-visible");
//             } else {
//               panel.classList.add("options-menu-visible");
//             }
//           }}">
//         </bim-button>
//       `;
//   });
  
//   document.body.append(button);