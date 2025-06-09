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

async function generatePDF() {
  const logoBase64 = await getBase64FromImageUrl(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Coat_of_Arms_of_City_Makassar.png/500px-Coat_of_Arms_of_City_Makassar.png?20180118184015"
  );
  const logoPkm = await getBase64FromImageUrl("/logo-puskesmas.png");
  const stempel = await getBase64FromImageUrl("/stempel.png");
  const ttd = await getBase64FromImageUrl("/ttd.png");

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
          body: [
            [
              {
                image: "logo",
                width: 60,
                alignment: "center",
              },
              {
                text: "PEMERINTAH KOTA MAKASSAR \n DINAS KESEHATAN \n PUSKESMAS ANTANG",
                alignment: "center",
                style: "header",
              },
              {
                image: "pkm",
                width: 50,
                alignment: "center",
                margin: [0, 10, 0, 0],
              },
            ],
            [
              { text: "", alignment: "center" },
              {
                text: "Jl. Antang Raya No.43, Antang, Kec. Manggala, Kota Makassar,  Sulawesi Selatan 90234 \n Telp : 0821-8880-3291",
                alignment: "center",
                margin: [0, -25, 0, 0],
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
        margin: [0, 1, 0, 10],
      },
      {
        text: "SURAT KETERANGAN SAKIT",
        style: ["subheader", "boldUnderline"],
        alignment: "center",
      },
      {
        text: `No.133.023/7030/PKM-ATG/VI/2025 `,
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
              { text: `: Muhammad Akbar`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Umur", margin: [40, 3, 0, 0] },
              { text: `: 25 Tahun`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Jenis Kelamin", margin: [40, 3, 0, 0] },
              { text: `: Laki-Laki`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Alamat", margin: [40, 3, 0, 0] },
              { text: `: Moncongloe `, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Pekerjaan", margin: [40, 3, 0, 0] },
              { text: `: Karyawan Swasta`, margin: [0, 3, 0, 0] },
            ],
            [
              { text: "Diagnosa", margin: [40, 3, 0, 0] },
              { text: `: Febris`, margin: [0, 3, 0, 0] },
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
        text: `istirahat selama 2 hari, mulai tanggal 07 Juni s/d 08 Juni 2025`,
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
                text: `Makassar, 09 Juni 2025 \n  Dokter Pemeriksa,`,
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
                margin: [0, -40, 0, 0],
                // opacity: 0.5,
              },
            ],
            [
              { text: "\n" },
              { text: "" },
              {
                image: "ttd",
                width: 150,
                alignment: "center",
                margin: [0, -110, 0, 0],
                // opacity: 0.5,
              },
            ],
            // [{ text: "\n" }, { text: "" }, { text: "" }],
            [{ text: "\n" }, { text: "" }, { text: "" }],
            [
              { text: "" },
              { text: "" },
              {
                text: `dr Kusuma`,
                alignment: "center",
                margin: [0, -70, 0, 0],
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
