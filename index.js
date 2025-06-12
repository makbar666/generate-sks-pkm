function getBase64FromImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = function () {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function handleImageUpload(input, previewId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById(previewId).src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function resetOffset() {
  document.getElementById("stempelXOffset").value = 0;
  document.getElementById("stempelYOffset").value = -40;
  document.getElementById("ttdXOffset").value = 0;
  document.getElementById("ttdYOffset").value = -130;
}

async function generatePDF() {
  const logoBase64 =
    document.getElementById("logoPreview").src ||
    (await getBase64FromImageUrl("maros.png"));
  const logoPkm =
    document.getElementById("pkmPreview").src || "logo-puskesmas.png";
  const stempel =
    document.getElementById("stempelPreview").src ||
    (await getBase64FromImageUrl("stempel.png"));
  const ttd =
    document.getElementById("ttdPreview").src ||
    (await getBase64FromImageUrl("ttd.png"));

  let stempelXOffset =
    parseInt(document.getElementById("stempelXOffset").value) || 0;
  let stempelYOffset =
    parseInt(document.getElementById("stempelYOffset").value) || -40;
  let ttdXOffset = parseInt(document.getElementById("ttdXOffset").value) || 0;
  let ttdYOffset =
    parseInt(document.getElementById("ttdYOffset").value) || -120;

  stempelXOffset = Math.max(Math.min(stempelXOffset, 50), -50);
  stempelYOffset = Math.max(Math.min(stempelYOffset, 50), -50);
  ttdXOffset = Math.max(Math.min(ttdXOffset, 50), -50);
  ttdYOffset = Math.max(Math.min(ttdYOffset, 140), -140);

  // Get input values
  const cityName = document.getElementById("cityName").value;
  const puskesmasName = document.getElementById("puskesmasName").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const patientName = document.getElementById("patientName").value;
  const age = document.getElementById("age").value;
  const patientAddress = document.getElementById("patientAddress").value;
  const occupation = document.getElementById("occupation").value;
  const diagnosis = document.getElementById("diagnosis").value;
  const gender = document.getElementById("gender").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const sickDays = document.getElementById("sickDays").value;
  const letterDate = document.getElementById("letterDate").value;
  const letterNumber = document.getElementById("letterNumber").value;
  const namaTtd = document.getElementById("namaTtd").value;

  // Format dates
  const formattedStartDate = new Date(startDate).toLocaleDateString("id-ID");
  const formattedEndDate = new Date(endDate).toLocaleDateString("id-ID");
  const formattedLetterDate = new Date(letterDate).toLocaleDateString("id-ID");

  // Define the document definition
  const docDefinition = {
    images: {
      logo: logoBase64,
      pkm: logoPkm,
      stempel: stempel,
      ttd: ttd,
    },
    content: [
      {
        style: "tableExample",
        table: {
          widths: [100, "*", 100],
          heights: [60, 30, 10], // Menentukan tinggi setiap baris

          body: [
            [
              {
                image: "logo",
                width: 60,
                height: 70, // Tentukan tinggi tetap
                alignment: "center",
                fit: [60, 70], // Pastikan gambar fit dalam dimensi yang ditentukan
              },
              {
                text: `PEMERINTAH ${cityName} \n DINAS KESEHATAN \n ${puskesmasName}`,
                alignment: "center",
                style: "header",
              },
              {
                image: "pkm",
                width: 50,
                alignment: "center",
                margin: [0, 0, 0, 0],
              },
            ],
            [
              { text: "", alignment: "center" },
              {
                text: `${address} \n Telepon : ${phone}`,
                alignment: "center",
                margin: [0, -10, 0, 0], // Sesuaikan margin atas
              },
              { text: "", alignment: "center" },
            ],
            [
              { text: "", alignment: "center" },
              { text: "", alignment: "center", style: "small" },
              { text: "", alignment: "center" },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 510,
            y2: 0,
            lineWidth: 1,
          },
        ],
        margin: [0, -10, 0, 10],
      },
      {
        text: "SURAT KETERANGAN SAKIT",
        style: ["subheader", "boldUnderline"],
        alignment: "center",
      },
      {
        text: `No.${letterNumber} `,
        alignment: "center",
        margin: [0, -5, 0, 15],
      },
      {
        text: "Yang bertanda tangan di bawah ini menerangkan bahwa:",
        margin: [0, 0, 0, 10],
      },
      {
        style: "tableExample",
        table: {
          widths: [130, "*"],
          body: [
            [
              { text: "Nama", margin: [40, 3, 0, 0] },
              { text: `: ${patientName}`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Umur", margin: [40, 3, 0, 0] },
              { text: `: ${age} Tahun`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Jenis Kelamin", margin: [40, 3, 0, 0] },
              { text: `: ${gender}`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Alamat", margin: [40, 3, 0, 0] },
              { text: `: ${patientAddress}`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Pekerjaan", margin: [40, 3, 0, 0] },
              { text: `: ${occupation}`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Diagnosa", margin: [40, 3, 0, 0] },
              { text: `: ${diagnosis}`, margin: [0, 3, 0, 0] },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        text: `Bahwa pada pemeriksaan kesehatan pada saat ini ternyata dalam keadaan Sakit, sehingga perlu `,
        margin: [0, 10, 0, 5],
      },
      {
        text: `istirahat selama ${sickDays} hari, mulai tanggal ${formattedStartDate} s/d ${formattedEndDate}.`,
        margin: [0, 0, 0, 15],
      },
      {
        text: `Demikian surat keterangan ini dibuat agar digunakan sebagaimana mestinya.`,
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: [100, 200, 200],
          body: [
            [
              { text: "" },
              { text: "" },
              {
                text: `${cityName}, ${formattedLetterDate} \n  Dokter Pemeriksa,`,
                alignment: "center",
              },
            ],
            [
              { text: "\n" },
              { text: "" },
              {
                image: "stempel",
                width: 150,
                alignment: "center",
                margin: [stempelXOffset, stempelYOffset, 0, 0], // Terapkan offset di sini
              },
            ],
            [
              { text: "\n" },
              { text: "" },
              {
                image: "ttd",
                width: 130,
                height: 130,
                fit: [130, 130],
                opacity: 0.9,
                alignment: "center",

                margin: [ttdXOffset, ttdYOffset, 0, 0], // Terapkan offset di sini
              },
            ],
            [{ text: "\n" }, { text: "" }, { text: "" }],
            [
              { text: "" },
              { text: "" },
              {
                absolutePosition: { x: 360, y: 550 }, // Sesuaikan x dan y sesuai kebutuhan (x: 400 untuk tengah kanan, y: 700 untuk posisi bawah)
                text: `dr ${namaTtd}`,
                alignment: "center",
              },
            ],
          ],
        },
        layout: "noBorders",
      },
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 3],
      },
      normal: {
        fontSize: 12,
        margin: [0, 0, 0, 0],
      },
      small: {
        fontSize: 10,
        margin: [0, 5, 0, 5],
      },
      italic: {
        italics: true,
        fontSize: 11,
      },
      underline: {
        decoration: "underline",
        fontSize: 11,
      },
      bold: {
        bold: true,
      },
      boldUnderline: {
        bold: true,
        decoration: "underline",
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 5],
      },
    },
  };

  // Generate PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  // Get PDF as base64 string
  pdfDocGenerator.getBase64((data) => {
    const iframe = document.getElementById("pdfPreview");
    iframe.src = "data:application/pdf;base64," + data;
  });
}
