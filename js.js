async function fetchXml(url) {
  try {
    // Użycie serwera proxy, aby obejść problem CORS
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const response = await fetch(proxyUrl + url, {
      headers: {
        Origin: "X-Requested-With", // Zastąp 'your-domain.com' swoją domeną
      },
    });
    const dataXml = await response.text(); // Pobieranie XML jako ciąg znaków
    return dataXml;
  } catch (error) {
    console.error("Error fetching XML:", error);
  }
}

async function processXml() {
  // const xmlUrl = "crd.gov.pl/wzor/2012/01/17/747/schemat.xsd";
  const xmlUrl = "crd.gov.pl/wzor/2012/01/17/747/wyroznik.xml";
  const xmlString = await fetchXml(xmlUrl);

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  // xmlCode.innerText = xmlString;

  console.log(xmlDoc.documentElement);
  przetworzNode(xmlDoc.documentElement);
  xmlCode.innerText = FmmoXSD.lines.join("\n");
  console.log(FmmoXSD.lines);
}
processXml();

function przetworzNode(aNode, aIndent = "") {
  FmmoXSD.lines.push(
    aIndent + " " + aNode.nodeName + " Attr: [" + attrNodesTOstr(aNode) + "]"
  );
  if (aNode.nodeType === Node.TEXT_NODE) {
    FmmoXSD.lines.push(aIndent + " Text: " + aNode.nodeValue);
  }
  if (aNode.hasChildNodes()) {
    for (let i = 0; i < aNode.childNodes.length; i++) {
      przetworzNode(aNode.childNodes[i], aIndent + "- ");
    }
  }
}

function attrNodesTOstr(node, excludeAttrs = []) {
  let attrs = [];
  if (node.attributes) {
    for (let i = 0; i < node.attributes.length; i++) {
      let attr = node.attributes[i];
      if (!excludeAttrs.includes(attr.name)) {
        attrs.push(attr.name + '="' + attr.value + '"');
      }
    }
  }
  return attrs.join(", ");
}

const FmmoXSD = {
  lines: [],
  addLine: function (line) {
    this.lines.push(line);
  },
};

// function loadXMLFile(file, callback) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', file, true);
//   xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4 && xhr.status === 200) {
//           callback(xhr.responseXML);
//       }
//   };
//   xhr.send();
// }

// loadXMLFile("example.xml", function (xml) {
//   const mainNode = xml.documentElement;
//   przetworzNode(mainNode);
//   document.getElementById("output").innerText = FmmoXSD.lines.join("\n");
// });

//   async function processXml() {
//     const xmlUrl = 'http://crd.gov.pl/wzor/2012/01/17/747/wyroznik.xml';

//     // Pobieranie XML
//     const xmlString = await fetchXml(xmlUrl);

//     if (xmlString) {
//       // Parsowanie ciągu XML na obiekt XML
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

//       // Sprawdzanie, czy parsowanie zakończyło się błędem
//       if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
//         console.error('Error parsing XML.');
//       } else {
//         // Przykładowa operacja: wypisanie zawartości pierwszego elementu 'wyroznik'
//         const wyroznik = xmlDoc.getElementsByTagName('wyroznik')[0];
//         if (wyroznik) {
//           console.log('First wyroznik element content:', wyroznik.textContent);
//         } else {
//           console.log('No wyroznik element found in the XML.');
//         }
//       }
//     }
//   }

// Uruchomienie funkcji
//   processXml();
