import React, { useState } from 'react';
import Section from './section';

interface IconData {
  type: 'class' | 'svg' | 'img';
  value: string; // class name, SVG string, or image URL
  style?: React.CSSProperties; // for inline styles like font-size
  alt?: string; // for img type
  viewBox?: string; // for svg type
  width?: string; // for svg type
  height?: string; // for svg type
}

interface Tab {
  id: string;
  title: string;
  icon: IconData;
  selected: boolean;
  className?: string;
}

interface ProjectLogo {
  type: 'initial' | 'image';
  value: string; // initial character or image URL
  backgroundColor?: string; // for initial type
  alt?: string; // for image type
}

interface Project {
  name: string;
  description: string;
  href: string;
  logo: ProjectLogo;
}

interface OpensourceProjectsData {
  tabs: Tab[];
  projects: Project[];
}

interface Props {
  data: OpensourceProjectsData;
}

const DEFAULT_OPENSOURCE_PROJECTS_DATA: OpensourceProjectsData = {
  tabs: [
    {
      id: 'react-tabs-0',
      title: 'All projects',
      icon: {
        type: 'class',
        value: 'anticon icon-bars',
        style: { fontSize: '20px' },
      },
      selected: true,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 border-primary',
    },
    {
      id: 'react-tabs-2',
      title: 'Go',
      icon: {
        type: 'svg',
        value:
          '<svg viewBox="0 0 30 19" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="18"><defs><path id="go_svg__svg_go_adrc7_a" d="M0 0h30v18H0z"></path></defs><g transform="translate(0 .278)" fill="none" fill-rule="evenodd"><mask id="go_svg__svg_go_adrc7_b" fill="#fff"><use xlink:href="#go_svg__svg_go_adrc7_a"></use></mask><g mask="url(#go_svg__svg_go_adrc7_b)"><g transform="translate(.849 .563)"><path d="M24.319 4.317c-1.016-1.854-2.785-3.103-4.76-3.782-2.485-.855-5.089-.482-7.644-.26C9.659.473 7.486.899 5.69 2.359 4.308 3.483 3.406 5.076 2.847 6.744c-1.373 4.09-.744 8.541-.58 12.753.055 1.409.073 2.82.02 4.229-.05 1.323-.192 2.64-.236 3.963-.081 2.466.222 4.983 1.592 7.096a7.411 7.411 0 001.268 1.467c.104.094.258-.06.154-.153-2.039-1.834-2.735-4.532-2.803-7.18-.034-1.284.07-2.57.164-3.849a45.45 45.45 0 00.099-4.222c-.085-4.447-.854-9.04.337-13.407.466-1.707 1.285-3.324 2.57-4.563C7.114 1.256 9.34.738 11.602.52c2.504-.24 5.063-.604 7.523.104 2.069.596 3.961 1.896 5.006 3.801.067.123.255.014.188-.11h0z" stroke="#000" fill="#070707"></path><path d="M10.044.844c.189 0 .189-.281 0-.281-.188 0-.188.28 0 .28z" fill="#070707"></path><path d="M2.348 7.384c-.78-.18-1.489-.557-1.884-1.258C.124 5.52.166 4.773.441 4.154c.283-.637.832-1.118 1.475-1.403.826-.366 2.318-.482 2.99.199.098.1.254-.052.156-.152-.704-.712-2.082-.62-2.975-.339A3.072 3.072 0 00.25 4.046C-.053 4.68-.096 5.458.208 6.1c.39.824 1.198 1.286 2.081 1.49.138.032.197-.174.059-.206h0zM27.648 2.852c.958 1.387-.12 3.747-1.95 4.043-.138.023-.08.23.058.207 1.94-.314 2.986-2.64 2.195-4.168-.881-1.701-3.242-1.392-4.687-.656-.125.063-.014.248.11.185 1.302-.662 3.329-.98 4.274.389z" stroke="#000" fill="#070707"></path><path d="M12.352 10.455l.11-.018c-.014-.03-.026-.06-.039-.091-.075.078-.364.103-.477.174a4.165 4.165 0 00-.633.496c-.276.258-.64.696-.546 1.108.105.462.641.765 1.09.815.832.091 1.582-.365 2.403-.392.903-.03 2.492 1.008 2.706-.53.142-1.014-1.254-1.6-2.007-1.875-.066-.024-.094.08-.029.103.773.283 2.06.827 1.92 1.837-.104.746-.812.762-1.384.607-.449-.122-.856-.26-1.327-.245-.523.017-1.033.239-1.538.35-.601.132-1.75-.02-1.734-.836.009-.484.544-.915.896-1.182.141-.107.296-.232.473-.268.073-.016.208-.029.263-.087.03-.03.012-.095-.038-.09-.049.004-.086.011-.137.02-.069.013-.04.116.028.104h0z" stroke="#000" stroke-width="0.5" fill="#070707"></path><path d="M15.226 12.737c.162.424.204.893.19 1.346-.01.291-.068.61-.262.832-.361.414-1.28.148-1.173-.485.012-.071-.093-.101-.105-.03-.131.784.871 1.013 1.355.595.53-.458.314-1.726.1-2.288-.026-.066-.131-.037-.105.03h0z" stroke="#000" stroke-width="0.5" fill="#070707"></path><path d="M22.07 6.482c0-2.019-1.647-3.656-3.68-3.656-2.03 0-3.677 1.637-3.677 3.656 0 2.02 1.647 3.656 3.678 3.656 2.032 0 3.678-1.637 3.678-3.656z" stroke="#070707" stroke-width="0.5"></path><ellipse stroke="#070707" stroke-width="0.5" cx="9.054" cy="7.045" rx="3.678" ry="3.656"></ellipse><path d="M25.748 4.219a.846.846 0 00-.85-.844.846.846 0 00-.848.844c0 .466.38.843.849.843s.849-.377.849-.843z" fill="#070707"></path><circle fill="#070707" cx="2.829" cy="5.063" r="1"></circle><path d="M15.562 9.998c0-.544-.76-.985-1.698-.985s-1.698.441-1.698.985.76.984 1.698.984 1.698-.44 1.698-.984z" fill="#070707"></path><path d="M18.532 5.076a1.27 1.27 0 00-1.273 1.266c0 .699.57 1.265 1.273 1.265a1.27 1.27 0 001.274-1.265 1.27 1.27 0 00-1.274-1.266zm.513 2.07a.36.36 0 01-.36-.358.36.36 0 01.36-.358c.2 0 .361.16.361.358a.36.36 0 01-.36.358zM9.196 5.357a1.27 1.27 0 00-1.274 1.266c0 .699.57 1.265 1.274 1.265a1.27 1.27 0 001.273-1.265 1.27 1.27 0 00-1.273-1.266zm.512 2.071a.36.36 0 01-.36-.358.36.36 0 01.36-.359.36.36 0 110 .717z" fill="#070707" fill-rule="nonzero"></path><path d="M13.911 12.456c.166.706.188 1.663-.187 2.309-.337.58-1.1.26-1.318-.24-.22-.502-.108-1.154.032-1.662.02-.068-.09-.097-.11-.029-.152.552-.276 1.287.011 1.818.196.362.717.7 1.152.477.829-.425.7-1.975.53-2.701-.016-.069-.126-.04-.11.028h0z" stroke="#000" stroke-width="0.5" fill="#070707"></path><path d="M23.786 4.096c1.438 2.157 1.83 4.729 1.895 7.285.036 1.423-.024 2.847-.04 4.27-.006.66 0 1.321.025 1.982.02.542-.01 1.176.154 1.698.042.132.247.076.205-.058-.173-.548-.13-1.232-.152-1.803-.028-.72-.024-1.441-.015-2.161.018-1.424.07-2.846.027-4.27-.076-2.472-.529-4.973-1.916-7.053-.076-.114-.26-.006-.183.11h0z" stroke="#000" fill="#070707"></path></g></g></g>',
        viewBox: '0 0 30 19',
        width: '30',
        height: '19',
      },
      selected: false,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 grayscale',
    },
    {
      id: 'react-tabs-4',
      title: 'AI',
      icon: {
        type: 'svg',
        value:
          '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 11a1 1 0 100 2 1 1 0 000-2zm-2 1a2 2 0 114 0 2 2 0 01-4 0zM16.5 11a1 1 0 100 2 1 1 0 000-2zm-2 1a2 2 0 114 0 2 2 0 01-4 0zM10 15.5a.5.5 0 01.5.5v.003l.003.01c.004.009.014.027.036.053a.86.86 0 00.27.194c.28.14.7.24 1.191.24.492 0 .912-.1 1.19-.24a.86.86 0 00.271-.194.214.214 0 00.039-.063V16a.5.5 0 011 0c0 .568-.447.947-.862 1.154-.445.223-1.025.346-1.638.346s-1.193-.123-1.638-.346C9.947 16.947 9.5 16.568 9.5 16a.5.5 0 01.5-.5z" fill="#47495F"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16 5.5v2H8v-2a.5.5 0 00-1 0v2H6A2.5 2.5 0 003.5 10v7A2.5 2.5 0 006 19.5h12a2.5 2.5 0 002.5-2.5v-7A2.5 2.5 0 0018 7.5h-1v-2a.5.5 0 00-1 0zm-10 3A1.5 1.5 0 004.5 10v7A1.5 1.5 0 006 18.5h12a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0018 8.5H6z" fill="#47495F"></path></svg>',
        viewBox: '0 0 24 24',
        width: '28',
        height: '28',
      },
      selected: false,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 grayscale',
    },
    {
      id: 'react-tabs-6',
      title: 'React',
      icon: {
        type: 'svg',
        value:
          '<svg viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg" width="20"><g transform="translate(0 .278)" fill="#000" fill-rule="evenodd"><path d="M20 8.335c0-1.24-1.66-2.414-4.203-3.143.587-2.426.326-4.357-.823-4.975a1.885 1.885 0 00-.914-.213v.85c.188 0 .339.035.465.1.554.297.795 1.43.607 2.887-.044.359-.118.737-.207 1.122a20.996 20.996 0 00-2.59-.416A18.955 18.955 0 0010.64 2.64C11.969 1.484 13.216.85 14.064.85V0c-1.12 0-2.588.748-4.072 2.045C8.508.755 7.04.015 5.919.015v.85c.844 0 2.096.63 3.425 1.779-.571.56-1.142 1.197-1.684 1.903a20.23 20.23 0 00-2.593.42 10.841 10.841 0 01-.212-1.106C4.664 2.403 4.9 1.27 5.45.969a.958.958 0 01.47-.1V.02c-.343 0-.653.069-.922.214-1.146.618-1.402 2.544-.811 4.963C1.65 5.928 0 7.099 0 8.336c0 1.239 1.66 2.414 4.203 3.143-.587 2.426-.326 4.356.823 4.974.265.145.575.214.918.214 1.12 0 2.588-.748 4.072-2.045 1.484 1.29 2.952 2.03 4.073 2.03.342 0 .652-.07.921-.214 1.146-.618 1.403-2.545.811-4.963C18.35 10.746 20 9.57 20 8.335zm-5.308-2.544c-.15.492-.338 1-.55 1.507A20.456 20.456 0 0013.02 5.49c.579.08 1.137.179 1.671.3zm-1.867 4.063a20.184 20.184 0 01-.982 1.457 22.658 22.658 0 01-3.677.004 20.9 20.9 0 01-.987-1.45 19.45 19.45 0 01-.848-1.518 20.184 20.184 0 011.826-2.98 22.658 22.658 0 013.677-.003c.339.454.67.938.987 1.45.31.499.591 1.006.848 1.517a20.897 20.897 0 01-.844 1.523zm1.317-.496c.22.51.408 1.022.562 1.518-.534.122-1.096.225-1.68.305a20.864 20.864 0 001.118-1.823zm-4.134 4.07c-.379-.366-.758-.774-1.133-1.22.367.014.742.026 1.12.026.384 0 .763-.008 1.134-.027-.367.447-.746.855-1.12 1.22zM6.975 11.18c-.579-.08-1.137-.18-1.671-.301.15-.492.338-1 .55-1.507.167.305.342.61.534.915.192.306.387.603.587.893zm3.013-7.938c.379.366.758.774 1.133 1.22A26.965 26.965 0 0010 4.437c-.383 0-.762.007-1.133.026.367-.446.746-.854 1.12-1.22zM6.97 5.489a20.864 20.864 0 00-1.117 1.82 15.65 15.65 0 01-.563-1.518 21.016 21.016 0 011.68-.302zm-3.69 4.777C1.84 9.689.906 8.934.906 8.336c0-.6.934-1.359 2.377-1.931.35-.141.733-.267 1.129-.385.232.747.538 1.526.917 2.323a17.331 17.331 0 00-.905 2.312 12.945 12.945 0 01-1.141-.39zm2.194 5.45c-.554-.297-.795-1.43-.607-2.887.044-.359.118-.736.207-1.122.8.184 1.672.325 2.59.416.55.706 1.12 1.347 1.695 1.908-1.329 1.156-2.576 1.789-3.424 1.789a1.027 1.027 0 01-.461-.103zm9.67-2.906c.191 1.457-.045 2.59-.595 2.892a.958.958 0 01-.47.099c-.843 0-2.095-.63-3.424-1.778.571-.56 1.142-1.198 1.684-1.904a20.23 20.23 0 002.593-.42c.093.386.167.756.212 1.11zm1.57-2.544c-.351.14-.735.267-1.13.385a17.586 17.586 0 00-.917-2.323c.375-.794.676-1.568.905-2.312.403.118.787.248 1.145.389 1.443.576 2.377 1.331 2.377 1.93-.004.6-.938 1.358-2.38 1.93z" fill-rule="nonzero"></path><circle cx="10" cy="8.333" r="1.667"></circle></g></svg>',
        width: '20',
      },
      selected: false,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 grayscale',
    },
    {
      id: 'react-tabs-8',
      title: 'MacOS',
      icon: {
        type: 'svg',
        value:
          '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"></path></svg>',
        height: '20',
        width: '20',
      },
      selected: false,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 grayscale',
    },
    {
      id: 'react-tabs-10',
      title: 'Swift',
      icon: {
        type: 'svg',
        value:
          '<svg viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg" width="20"><path d="M16.086 18.033c-2.356 1.367-5.595 1.507-8.854.104C4.593 17.01 2.404 15.036 1 12.781c.674.564 1.46 1.015 2.302 1.41 3.365 1.584 6.73 1.475 9.098.003l-.003-.004c-3.369-2.593-6.232-5.977-8.365-8.74-.45-.45-.786-1.014-1.123-1.522 2.582 2.368 6.68 5.357 8.14 6.203C7.962 6.86 5.211 2.8 5.323 2.913c4.884 4.962 9.432 7.782 9.432 7.782.15.085.266.156.36.22.098-.252.184-.513.257-.784.786-2.876-.112-6.146-2.077-8.853 4.547 2.763 7.242 7.95 6.119 12.292-.03.117-.061.233-.095.347l.039.048c2.245 2.82 1.628 5.808 1.347 5.244-1.218-2.394-3.473-1.662-4.62-1.176h0z" stroke="#000" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        width: '20',
      },
      selected: false,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 grayscale',
    },
    {
      id: 'react-tabs-12',
      title: 'Android',
      icon: {
        type: 'svg',
        value:
          '<svg viewBox="0 0 19 23" xmlns="http://www.w3.org/2000/svg" height="21"><g transform="translate(1 1.278)" fill="none" fill-rule="evenodd"><g transform="matrix(-1 0 0 1 17 0)"><path d="M9.094 16.713H7.906v2.86a1.427 1.427 0 01-2.854 0v-2.86h-.641a1.32 1.32 0 01-1.32-1.32V6.725 6.71c0-1.877 1.027-3.523 2.569-4.442L4.794.635a.39.39 0 01.15-.52l.012-.008a.376.376 0 01.52.15l.881 1.66A5.56 5.56 0 018.5 1.49a5.56 5.56 0 012.143.426l.88-1.66a.376.376 0 01.521-.15l.013.007a.39.39 0 01.149.52l-.866 1.634c1.542.919 2.57 2.565 2.57 4.442v.015h0v8.668a1.32 1.32 0 01-1.32 1.32h-.642v2.86a1.427 1.427 0 11-2.854 0v-2.86z" stroke="#000"></path><rect stroke="#000" y="6.71" width="2.853" height="8.263" rx="1.427"></rect><rect stroke="#000" x="14.147" y="6.3" width="2.853" height="8.263" rx="1.427"></rect></g><circle stroke="#000" stroke-width="0.5" fill="#000" cx="10.5" cy="4.725" r="1"></circle><circle stroke="#000" stroke-width="0.5" fill="#000" cx="6.5" cy="4.725" r="1"></circle><path d="M2.942 6.949h11.056" stroke="#000"></path></g></svg>',
        height: '21',
      },
      selected: false,
      className:
        'inline-flex items-center py-3 border-b-2 border-solid border-transparent cursor-pointer focus:outline-none whitespace-no-wrap mr-9 md:mr-18 grayscale',
    },
  ],
  projects: [
    {
      name: 'Playbook',
      description:
        'Guides for getting things done, programming well, and programming in style.',
      href: 'https://github.com/dwarvesf/playbook',
      logo: {
        type: 'initial',
        value: 'P',
        backgroundColor: 'rgb(82, 165, 139)',
      },
    },
    {
      name: 'dotfiles',
      description: 'macOS & Ubuntu dotfiles using at Dwarves Foundation.',
      href: 'https://github.com/dwarvesf/dotfiles',
      logo: {
        type: 'initial',
        value: 'd',
        backgroundColor: 'rgb(82, 145, 165)',
      },
    },
    {
      name: 'Yggdrasil',
      description: 'The business service mesh written in Go',
      href: 'https://github.com/dwarvesf/yggdrasil',
      logo: {
        type: 'initial',
        value: 'Y',
        backgroundColor: 'rgb(82, 136, 165)',
      },
    },
    {
      name: 'Hidden',
      description: 'A ultra-light MacOS utility that helps menu bar icons.',
      href: 'https://github.com/dwarvesf/hidden',
      logo: {
        type: 'image',
        value:
          'https://res.cloudinary.com/dwf/image/upload/v1605521848/Websites/OSS/hidden_yynuxb.png',
        alt: "Hidden's logo",
      },
    },
    {
      name: 'Blurred',
      description:
        'A macOS utility that helps reduce distraction by dimming your inactive noise.',
      href: 'https://github.com/dwarvesf/blurred',
      logo: {
        type: 'image',
        value:
          'https://res.cloudinary.com/dwf/image/upload/v1605521847/Websites/OSS/blurred_xr2ryk.png',
        alt: "Blurred's logo",
      },
    },
    {
      name: 'Playground',
      description: 'The Dwarves second brain',
      href: 'https://github.com/dwarvesf/playground',
      logo: {
        type: 'initial',
        value: 'P',
        backgroundColor: 'rgb(165, 82, 109)',
      },
    },
    {
      name: 'Session Buddy',
      description:
        'An ultra-light Safari extension helps you save open tabs as collections that can be easily restored later.',
      href: 'https://github.com/dwarvesf/session-buddy',
      logo: {
        type: 'image',
        value:
          'https://res.cloudinary.com/dwf/image/upload/v1613974518/Websites/OSS/session-buddy_wvqnsw.png',
        alt: "Session Buddy's logo",
      },
    },
    {
      name: 'Micro Sniff',
      description:
        'An ultra-light macOS utility that notify whenever your micro-device is being used.',
      href: 'https://github.com/dwarvesf/micro-sniff',
      logo: {
        type: 'image',
        value:
          'https://res.cloudinary.com/dwf/image/upload/v1605609151/Websites/OSS/micro-sniff_tl9ax4.png',
        alt: "Micro Sniff's logo",
      },
    },
    {
      name: 'Go Boilerplate',
      description:
        'The stable base upon which we build our Go projects at Dwarves Foundation.',
      href: 'https://github.com/dwarvesf/go-api',
      logo: {
        type: 'initial',
        value: 'G',
        backgroundColor: 'rgb(114, 82, 165)',
      },
    },
    {
      name: 'CodeViewer',
      description: 'A custom code editor SwiftUI view',
      href: 'https://github.com/dwarvesf/CodeViewer',
      logo: {
        type: 'initial',
        value: 'C',
        backgroundColor: 'rgb(116, 165, 82)',
      },
    },
    {
      name: 'Android Boilerplate',
      description:
        'The stable base upon which we build our Android projects at Dwarves Foundation.',
      href: 'https://github.com/dwarvesf/template-android-app',
      logo: {
        type: 'initial',
        value: 'A',
        backgroundColor: 'rgb(146, 82, 165)',
      },
    },
    {
      name: 'Auto DND',
      description:
        'Meet Auto DND - a mac app that keeps notifications stays right where it should.',
      href: 'https://github.com/dwarvesf/auto-dnd',
      logo: {
        type: 'image',
        value:
          'https://res.cloudinary.com/dwf/image/upload/v1613974529/Websites/OSS/auto-dnd_hd0qj5.png',
        alt: "Auto DND's logo",
      },
    },
    {
      name: 'LLM hosting',
      description:
        'Our deployment scripts for hosting LLMs, embeddings, and services',
      href: 'https://github.com/dwarvesf/llm-hosting',
      logo: {
        type: 'initial',
        value: 'L',
        backgroundColor: 'rgb(163, 82, 165)',
      },
    },
    {
      name: 'Mochi UI',
      description:
        'Beautiful and accessible React UI library for building web3 applications',
      href: 'https://github.com/consolelabs/mochi-ui',
      logo: {
        type: 'initial',
        value: 'M',
        backgroundColor: 'rgb(82, 165, 94)',
      },
    },
    {
      name: 'Go Thread',
      description:
        "Reverse-Engineered Golang client for Meta's Threads. Supports Read and Write",
      href: 'https://github.com/dwarvesf/go-threads',
      logo: {
        type: 'initial',
        value: 'G',
        backgroundColor: 'rgb(82, 151, 165)',
      },
    },
    {
      name: 'Prompts for Dev',
      description: 'A collection of prompts used to boost software development',
      href: 'https://github.com/dwarvesf/prompts-for-dev',
      logo: {
        type: 'initial',
        value: 'P',
        backgroundColor: 'rgb(89, 165, 82)',
      },
    },
    {
      name: 'til',
      description:
        "Today I Learned. Our knowledge hub. List out what we've learned everyday, organized.",
      href: 'https://github.com/dwarvesf/til',
      logo: {
        type: 'initial',
        value: 't',
        backgroundColor: 'rgb(82, 159, 165)',
      },
    },
    {
      name: 'React Toolkit',
      description:
        'A library of hooks and utilities to speed up building React applications',
      href: 'https://github.com/dwarvesf/react-toolkit',
      logo: {
        type: 'initial',
        value: 'R',
        backgroundColor: 'rgb(108, 82, 165)',
      },
    },
    {
      name: 'Elixir Boilerplate',
      description:
        'The stable base upon which we build our Elixir projects at Dwarves Foundation.',
      href: 'https://github.com/dwarvesf/template-elixir-phoenix',
      logo: {
        type: 'initial',
        value: 'E',
        backgroundColor: 'rgb(165, 148, 82)',
      },
    },
    {
      name: 'Next Boilerplate',
      description:
        'The stable base upon which we build our React.js project at Dwarves Foundation',
      href: 'https://github.com/dwarvesf/nextjs-boilerplate',
      logo: {
        type: 'initial',
        value: 'N',
        backgroundColor: 'rgb(137, 165, 82)',
      },
    },
    {
      name: 'Smithy',
      description:
        'is an admin dashboard written in Go and VueJS. It is designed to support multiple existed architectures and databases.',
      href: 'https://github.com/dwarvesf/smithy',
      logo: {
        type: 'initial',
        value: 'S',
        backgroundColor: 'rgb(82, 165, 87)',
      },
    },
    {
      name: 'iOS Boilerplate',
      description:
        'The stable base upon which we build our iOS projects at Dwarves Foundation.',
      href: 'https://github.com/dwarvesf/template-iOS-app',
      logo: {
        type: 'initial',
        value: 'i',
        backgroundColor: 'rgb(165, 82, 108)',
      },
    },
    {
      name: 'Glod',
      description:
        'is a small cli written in Go to help download music and video from multiple sources',
      href: 'https://github.com/dwarvesf/glod-cli',
      logo: {
        type: 'initial',
        value: 'G',
        backgroundColor: 'rgb(82, 165, 110)',
      },
    },
  ],
};

export default function OpensourceProjects({
  data = DEFAULT_OPENSOURCE_PROJECTS_DATA,
}: Props) {
  const [activeTab, setActiveTab] = useState(
    data.tabs.find(tab => tab.selected)?.id || data.tabs[0]?.id,
  );

  const renderIcon = (icon: IconData) => {
    if (icon.type === 'class') {
      return <i className={icon.value} style={icon.style}></i>;
    } else if (icon.type === 'svg') {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: icon.value }}
          style={{ width: icon.width, height: icon.height }}
        />
      );
    } else if (icon.type === 'img') {
      return (
        <img
          src={icon.value}
          alt={icon.alt}
          className="block h-10 w-10 flex-none rounded"
        />
      );
    }
    return null;
  };

  const renderLogo = (logo: ProjectLogo) => {
    if (logo.type === 'initial') {
      return (
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded text-2xl font-bold text-white uppercase"
          aria-label={`${logo.value}'s logo`}
          style={{ backgroundColor: logo.backgroundColor }}
        >
          {logo.value}
        </div>
      );
    } else if (logo.type === 'image') {
      return (
        <img
          src={logo.value}
          alt={logo.alt}
          className="block h-10 w-10 flex-none rounded"
        />
      );
    }
    return null;
  };

  return (
    <Section>
      <div className="mt-2" data-tabs="true">
        <ul
          className="border-alto flex overflow-x-auto border-b border-solid"
          role="tablist"
        >
          {data.tabs.map(tab => (
            <li
              key={tab.id}
              className={`${tab.className} ${activeTab === tab.id ? 'border-primary' : 'border-transparent grayscale'}`}
              role="tab"
              id={tab.id}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
            >
              {renderIcon(tab.icon)}
              <span className="ml-3">{tab.title}</span>
            </li>
          ))}
        </ul>
        {data.tabs.map(tab => (
          <div
            key={`panel-${tab.id}`}
            className={`react-tabs__tab-panel ${activeTab === tab.id ? 'react-tabs__tab-panel--selected' : ''}`}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
          >
            {activeTab === tab.id && (
              <ul className="row mt-12 md:flex md:flex-wrap">
                {data.projects.map(project => (
                  <li
                    key={project.name}
                    className="col mb-10 md:w-1/2 lg:w-1/3"
                  >
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-reset block"
                    >
                      <div className="flex">
                        {renderLogo(project.logo)}
                        <p className="ml-4">
                          <strong className="font-bold">{project.name}</strong>{' '}
                          {project.description}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
