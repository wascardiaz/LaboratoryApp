import { Role } from "../shared/models/user.model";

export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

// export enum Role {
//   User = 'User',
//   Moderator = 'Moderator',
//   Admin = 'Admin',
//   Bioanalista = 'Bioanalista',
//   SuperUser = 'Super Usuario',
//   Digitador = 'Digitador'
// }

export function capitalizeName(name: string) {
  const lower = name.toLowerCase().trim().split(' ');
  lower.map((word, index) => {
    // const uppercaseFirst = `${word[0].toUpperCase()}${word.substr(1)}`
    lower[index] = word.charAt(0).toUpperCase() + word.slice(1);
  });

  return lower.join(' ');
}

export function getBase64ImageFromURL(url: string) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => {
      reject(error);
    };
    img.src = url;
  });
}