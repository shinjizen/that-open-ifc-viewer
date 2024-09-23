// Upload Button
const upload = document.getElementById('upload-button') as HTMLButtonElement
const fileInput = document.getElementById('ifc-upload') as HTMLInputElement

upload.addEventListener('click', () => {
  fileInput.click()
})

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0]
  if (file) {
    // const fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(file);
    // fileReader.onload = async (e) => {
    //     const arrayBuffer = e.target?.result as ArrayBuffer
    //     const uint8Array = new Uint8Array(arrayBuffer);

    //     try {
    //       const model = await fragmentIfcLoader.load(uint8Array)
    //       world.scene.three.add(model);
    //     } catch (err) {
    //       console.error('Failed to load IFC file: ', err);
    //     }
    // };

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed:')
    }

    const result = await response.text()
    console.log(result)

    const ifcLink = document.getElementById('ifc-link') as HTMLAnchorElement
    // const ifcViewer = document.getElementById('ifc-viewer') as HTMLIFrameElement

    const fileURL = `http://localhost:5173/viewer/ifc/${file.name}`

    console.log('fileURL: ' + fileURL)

    if (fileURL) {
      ifcLink.href = fileURL
      ifcLink.style.display = 'block'
      ifcLink.innerText = fileURL

      // ifcViewer.src = fileURL
      // ifcViewer.hidden = false
    }
  }
})
