export function getHTMLOrderDetail(data) {
  let HTMLTBODY = ``;
  data.products.forEach((element) => {
    HTMLTBODY += `<tr class="">
                  <td scope="row">${element?.producto_data?.name ?? ""}</td>
                  <td>${element?.price ?? ""}</td>
                  <td>${element?.cantidad ?? ""}</td>
                  <td>${element?.stock_data?.size ?? ""}</td>
                  <td>${element?.price * element?.cantidad ?? ""}</td>
                </tr>`;
  });

  let HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CORREO TEST</title>
    <style>
      * {
        font-family: Tahoma, sans-serif;
      }
      .container {
        margin: auto;
        width: 95%;
      }
      .text-center {
        text-align: center;
      }
      .card-img-top {
        padding: 2em 0;
      }
      .card {
        border: 1px solid red;
        border-radius: 0.3em;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      }
      .card-body {
        padding: 2em;
      }
      hr {
        margin: 0;
        border-color: rgb(255, 204, 204);
      }
      .btn {
        margin-top: 3em;
        background-color: #e69595;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        padding: 1em;
        text-decoration: none;
      }
      p {
        margin-bottom: 1em;
      }

      table {
        border-collapse: collapse;
        background-color: white;
        width: 500px;
        border-radius: 0.3em;
      }
      .table-responsive{
        background-color: white;
        border-radius: 0.3em;
        overflow: hidden;

        border: #e69595 solid 1px;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

      }

      th,
      td {
        font-family: "Motnserrat", sans-serif;
        text-align: left;
        font-size: 12px;
        padding: 10px;
      }

      th {
        background-color: #ff8080;
        color: white;
      }
      h3{
        color: #494949;
        text-transform: uppercase;
      }
    </style>
  </head>

  <body>
    <div class="container mt-5">
      <div class="card shadow" style="border-color: rgb(255, 207, 207)">
        <div
          class="text-center pt-4 m-0 pb-2"
          style="background-color: rgb(255, 180, 180)"
        >
          <img
            class="card-img-top"
            src="https://esmuller.cloud/assets/Logo-LBxHafXJ.png"
            alt="Title"
            style="width: 110px"
          />
        </div>
        <hr class="m-0" />
        <div class="card-body text-center">
          <h3>Detalle de su Compra</h3>
          <div class="table-responsive" style="margin-bottom: 1em;">
            <table class="table table-primary" style="width: 100%">
                <tr class="">
                  <td scope="row">Nombre</td>
                  <td>${data?.cliente?.name_client ?? ""}</td>
                </tr>
                <tr class="">
                  <td scope="row">Telefono</td>
                  <td>${data?.cliente?.phone_client ?? ""}</td>
                </tr>
                <tr class="">
                  <td scope="row">Direccion</td>
                  <td>${data?.address?.address ?? ""}</td>
                </tr>
                <tr class="">
                  <td scope="row">Cuidad</td>
                  <td>${data?.address?.city ?? ""}</td>
                </tr>
                <tr class="">
                  <td scope="row">Departamento.</td>
                  <td>${data?.address?.departament ?? ""}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive">
            <table class="table table-primary" style="width: 100%">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio U.</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Talla</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                
${HTMLTBODY}
                
              </tbody>
            </table>
          </div>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
            minima suscipit provident repudiandae porro id rerum quasi quos?
            Voluptate consequuntur fugit quia sequi aspernatur voluptas nisi
            iusto? Similique, aut minima.
          </p>
          <div style="margin-top: 10px">
            <a
              href="https://ecommerce.esmuller.cloud/"
              class="button-9 btn btn-danger"
              >Explorar Tienda</a
            >
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

  return HTML;
}
