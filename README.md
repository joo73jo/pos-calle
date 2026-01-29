# Calcubit – Sistema POS Móvil para Gestión de Ventas e Inventario

Calcubit es una aplicación móvil multiplataforma desarrollada como parte de un proyecto académico y práctico, orientada a la gestión integral de ventas, inventario y entregas a domicilio para pequeños y medianos negocios del sector gastronómico. El sistema busca reemplazar procesos manuales y desorganizados por una solución digital centralizada, accesible y segura.

La aplicación está construida utilizando Ionic Framework con Angular en arquitectura standalone, permitiendo su despliegue en dispositivos Android mediante Capacitor. El backend se apoya en Supabase, el cual provee servicios de autenticación, base de datos y almacenamiento de archivos en la nube.

Repositorio del proyecto:
[https://github.com/joo73jo/pos-calle](https://github.com/joo73jo/pos-calle)

---

## Descripción general del sistema

El sistema está diseñado bajo un esquema de roles, donde cada usuario accede únicamente a las funcionalidades correspondientes a su perfil:

* Administrador: gestión de productos, inventario, ventas, reportes y control general del sistema.
* Vendedor: registro de ventas locales y a domicilio, manejo del carrito y selección de método de pago.
* Repartidor: visualización de pedidos asignados, actualización de estados de entrega y control de efectivo.

La información se gestiona en tiempo real mediante Supabase, aplicando políticas de seguridad Row Level Security (RLS) para garantizar que cada usuario solo acceda a los datos permitidos según su rol.

---

## Requisitos del sistema

Para replicar el entorno de desarrollo y ejecución se requiere:

* Node.js versión 18 LTS
* npm
* Java Development Kit (JDK) versión 17
* Android Studio con Android SDK, Build Tools y Emulator
* Un proyecto activo en Supabase

---
Configuración de la aplicación

La aplicación requiere un proyecto activo en Supabase para su correcto funcionamiento. Una vez creado el proyecto, se deben configurar las credenciales de conexión dentro del frontend. Estas credenciales corresponden a la URL del proyecto y a la clave pública (anon key), las cuales se utilizan para inicializar el cliente de Supabase desde la aplicación móvil.

En Supabase se deben crear las tablas necesarias para el funcionamiento del sistema, tales como perfiles de usuario, productos, ventas, detalle de ventas y deliveries. Asimismo, es indispensable configurar las políticas de seguridad Row Level Security (RLS) para controlar el acceso a la información según el rol del usuario autenticado. Estas políticas permiten que los vendedores, repartidores y administradores accedan únicamente a los datos que les corresponden.

Para el manejo de imágenes de productos, se debe crear un bucket en Supabase Storage con permisos adecuados para permitir la carga de imágenes desde la aplicación y la obtención de URLs públicas para su visualización.

La configuración de Capacitor se realiza a través del archivo capacitor.config.ts, donde se define el identificador de la aplicación, el nombre y el directorio web generado por Ionic. Esta configuración es necesaria para la correcta sincronización entre el frontend web y la plataforma Android.

Forma de trabajo de la aplicación

El sistema funciona bajo un esquema de roles que define el flujo de uso de la aplicación. Cada usuario accede únicamente a las funcionalidades asociadas a su rol, garantizando un uso controlado y organizado del sistema.

El administrador es responsable de la gestión general del sistema. Desde su perfil puede crear y editar productos, controlar el inventario, consultar ventas, generar reportes y supervisar los pedidos realizados. También puede desactivar productos sin eliminar su historial, asegurando la integridad de la información.

El vendedor utiliza la aplicación como punto de venta. Su flujo de trabajo inicia con el registro de una venta, donde selecciona los productos, define el tipo de venta (local o a domicilio) y el método de pago del cliente. En caso de ventas a domicilio, el sistema permite asignar un repartidor, generando automáticamente un registro de delivery asociado a la venta.

El repartidor accede a la lista de pedidos que le han sido asignados. Desde su interfaz puede actualizar el estado de entrega del pedido, registrar su progreso y reportar la ubicación cuando corresponde. Adicionalmente, el sistema permite controlar el estado del efectivo cuando el pago se realiza en efectivo, diferenciando entre dinero pendiente, entregado o adeudado al local.

Todas las operaciones realizadas en la aplicación se sincronizan en tiempo real con Supabase, lo que permite que los distintos roles visualicen la información actualizada de manera inmediata. Este enfoque elimina la dependencia de procesos manuales y mejora la trazabilidad de ventas, inventario y entregas.

## Instalación

Clonar el repositorio del proyecto:

```bash
git clone https://github.com/joo73jo/pos-calle.git
cd pos-calle
```

Instalar las dependencias del proyecto:

```bash
npm install
```

---

## Configuración

Crear un proyecto en Supabase y obtener las credenciales correspondientes (Project URL y anon public key).
Estas credenciales deben configurarse en los archivos de entorno del proyecto.

Verificar que el archivo `capacitor.config.ts` tenga correctamente definido el directorio web:

```ts
webDir: 'www'
```

Supabase se encarga de la autenticación de usuarios, la persistencia de datos y el almacenamiento de imágenes, por lo que no es necesario desplegar un servidor backend propio.

---

## Ejecución en entorno web (desarrollo)

Para ejecutar la aplicación en modo desarrollo desde el navegador:

```bash
npx ionic serve
```

La aplicación estará disponible en `http://localhost:8100`.

---

## Ejecución en Android

Generar el build del proyecto Ionic:

```bash
npx ionic build
```

Sincronizar el proyecto con la plataforma Android:

```bash
npx ionic cap sync android
```

Abrir el proyecto en Android Studio:

```bash
npx ionic cap open android
```

Desde Android Studio se puede ejecutar la aplicación en un emulador o en un dispositivo físico con la depuración USB habilitada.

---

## Flujo de trabajo recomendado

Cada vez que se realicen cambios en el código fuente (HTML, SCSS o TypeScript), se debe ejecutar nuevamente:

```bash
npx ionic build
npx ionic cap sync android
```

Esto asegura que los cambios se reflejen correctamente en la aplicación Android.

---

## Funcionalidades principales

* Registro e inicio de sesión de usuarios con distintos roles
* Punto de venta (POS) para ventas locales y a domicilio
* Gestión de productos y control de inventario
* Registro y anulación de ventas
* Asignación y seguimiento de pedidos a repartidores
* Control de estados de entrega y manejo de efectivo
* Consultas y reportes administrativos

---

## Tecnologías utilizadas

* Ionic Framework
* Angular (arquitectura standalone)
* Capacitor
* Supabase (Auth, Database y Storage)
* Android SDK

---

## Autores

Proyecto desarrollado por:

* Joel Parra – Quito, Ecuador

* Allison Viracocha

* Karla Rodríguez

---

