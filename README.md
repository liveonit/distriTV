<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

# PROJECT STATUS

| SERVICE                         | STATUS                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Back-office Dashboard Linter    | ![Status](https://github.com/liveonit/distriTV/actions/workflows/linter_frontend.yml/badge.svg)           |
| Back-office Dashboard Tests     | No tested yet                                                                                                 |
| Backend Linter                  | ![Status](https://github.com/liveonit/distriTV/actions/workflows/linter_backend.yml/badge.svg)            |
| Backend Integration Tests       | ![Status](https://github.com/liveonit/distriTV/actions/workflows/backend_integration_tests.yml/badge.svg) |

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="/">
    <img src="docs/images/reamde-image.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">DistriTV</h3>

  <p align="center">
    Scheduled content distribution
    <br />
    <a href="https://github.com/liveonit/distriTV"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://triactivesoft.ddns.net/">View Demo</a>
    ·
    <a href="https://github.com/liveonit/distriTV/issues">Report Bug</a>
    ·
    <a href="https://github.com/liveonit/distriTV/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](demo-url)

DistriTV is a system created to distribute and schedule image, video, and text content across Android TV devices across multiple locations. The system consists of a Web Backoffice implemented in React and an Android APP. Users are able to upload contents directly to the backoffice and then schedule its reproduction on the Android TV devices based on customizable criteria, such as location, institution, or custom labels. All the communication to the devices is made by the backoffice via the network, no user interaction or physical handling is required.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/kotlin-%237F52FF.svg?style=for-the-badge&logo=kotlin&logoColor=white)

![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Here are the instructions to execute the project locally and install the application on the demo TV.

### Prerequisites

* Docker is required to be installed locally to serve the backoffice. Refer to their [official documentation](https://docs.docker.com/desktop/) on how to install it. After installing it, make sure that the service is running.

* Android studio is required to build the APK for the Android TV. It can be obtained [here](https://developer.android.com/studio)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/liveonit/distriTV.git
   ```

#### Backoffice
2. Create a copy of the `.env.example` file and name it `.env`. Remember to set secure values when deploying to a production environment.
3. Execute the docker compose
   ```sh
   docker compose up -d --build
   ```
4. Visit http://localhost/

#### Android TV

5. On Android Studio, after importing the project, go to `Build -> Select Build Variant`. There you can choose between `debug` and `release`
6. To generate the APK, go to `Build -> Build Bundle(s) / APK(s) -> Build APK(s)`. The file exported to 
    ```
    services/mobileDistriTV/app/build/outputs/apk
    ```
7. To install on the Demo PC, do a factory reset and don´t connect to the internet. Go to storage, select the APK and install it. Now connect to the internet.

### Troubleshooting

Here is a list of common issues and how to solve it:

* `Failed to find Build Tools revision x.x.x x` - When trying to Make Project or build the APK
  
  Make sure that the `buildToolsVersion` value in the `build.gradle` file matches with one of the installed versions of Android SDK Build-Tools. To check, go to:
    ```
    File -> Settings -> Appeareance & Beahavior -> System Settings -> Android SDK -> SDK Tools -> Show Package Details
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

After first installing the app on the device the app it will ask the user an identifier used to sync it with the backoffice. After that the app will automatically download and reproduce content if scheduled in backoffice. It will continue to work even when minimize. If the device is restarted, the app will start automatically.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/liveonit/distriTV/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

1. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
6. Get approvers

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Ignacio Barreto - ibarretorey@gmail.com

Malva Goitiño - alvarogoitino@gmail.com

Matías Gonnet - gonnet.matias@gmail.com

Facundo Ramírez - facundoramirezb@gmail.com

Martín Riani - martiniano13@gmail.com

Project Link: [https://github.com/liveonit/distriTV](https://github.com/liveonit/distriTV)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* Leonardo Martínez
* Germán Capdehourat
* Rodolfo Roballo

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/liveonit/distriTV.svg?style=for-the-badge
[contributors-url]: https://github.com/liveonit/distriTV/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/liveonit/distriTV.svg?style=for-the-badge
[forks-url]: https://github.com/liveonit/distriTV/network/members
[stars-shield]: https://img.shields.io/github/stars/liveonit/distriTV.svg?style=for-the-badge
[stars-url]: https://github.com/liveonit/distriTV/stargazers
[issues-shield]: https://img.shields.io/github/issues/liveonit/distriTV.svg?style=for-the-badge
[issues-url]: https://github.com/liveonit/distriTV/issues
[license-shield]: https://img.shields.io/github/license/liveonit/distriTV.svg?style=for-the-badge
[license-url]: https://github.com/liveonit/distriTV/blob/main/LICENSE.txt
[product-screenshot]: docs/images/dashboard.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 

<!-- -->
[demo-url]: http://triactivesoft.ddns.net/