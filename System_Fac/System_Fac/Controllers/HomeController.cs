using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System_Fac.Models;

namespace System_Fac.Controllers
{
    public class HomeController : Controller
    {
        private static byte[] xmlBytes;
        private static byte[] cdrBytes;
        private static byte[] pdfBytes;
        private static FormularioViewModel previousFormData;
        private static string pdfNombre;
        private static string xmlNombre;
        private static string cdrNombre;
        public ActionResult Index()
        {
            var model = previousFormData ?? new FormularioViewModel();
            return View(model);
        }
        [HttpPost]
        public ActionResult Index(string RUC, string tipo, string folio, string fecha, string montototal, string g_recaptcha_response)
        {
            TempData["RUC"] = RUC;
            TempData["Tipo"] = tipo;
            TempData["Folio"] = folio;
            TempData["Fecha"] = fecha;
            TempData["MontoTotal"] = montototal;

            // Crear una instancia de FormularioViewModel y asignar los valores del formulario
            var formData = new FormularioViewModel
            {
                RUC = RUC,
                Tipo = tipo,
                Folio = folio,
                Fecha = fecha,
                MontoTotal = montototal
            };

            // Asignar los datos del formulario a previousFormData
            previousFormData = formData;

            if (tipo == "Factura")
            {
                tipo = "01";
            }
            else if (tipo == "Boleta")
            {
                tipo = "03";
            }
            else if (tipo == "Nota de Crédito")
            {
                tipo = "07";
            }
            else if (tipo == "Nota de Débito")
            {
                tipo = "08";
            }

            // Crear una instancia de Consulta y asignar los valores del formulario
            var consulta = new Consulta
            {
                token = "AA",
                ruc = RUC,
                tipoDocumento = tipo,
                numeroDocumento = folio,
                fechaEmision = fecha,
                monto = montototal
            };
            DBApi dbApi = new DBApi();
            dynamic respuesta = dbApi.Post("http://45.34.15.231/FE_ConsultaServicio/BismarckWCF.svc/Bismarck/getDocumento", JsonConvert.SerializeObject(consulta));

            JObject factura = JObject.Parse(Convert.ToString(respuesta));
            string texto = factura["Texto"].ToObject<string>();

            if (texto == "")
            {
                // Obtener los bytes del PDF y XML de la respuesta JSON
                
                pdfBytes = factura["PDFbyte"].ToObject<byte[]>();
                xmlBytes = factura["XMLbyte"].ToObject<byte[]>();
                cdrBytes = factura["CDRbyte"].ToObject<byte[]>();
                pdfNombre = factura["PDFFileName"].ToObject<string>();
                xmlNombre = factura["XMLFileName"].ToObject<string>();
                cdrNombre = factura["CDRFileName"].ToObject<string>();


                // Pasar los datos a la vista "VistaPDF" a través del modelo
                ViewBag.VirtualPath = SavePdfAndGetVirtualPath(pdfBytes);

                return View("VistaPDF");
            }
            else
            {
                // El documento no existe, agregar mensaje de error al modelo de vista
                var model = previousFormData ?? new FormularioViewModel();
                model.ErrorMessage = "El documento no existe";

                return View(model);
            }
        }

        private string SavePdfAndGetVirtualPath(byte[] pdfBytes)
        {
            if (pdfBytes == null)
            {
                return null; // Si pdfBytes es nulo, no se hace nada y se devuelve null
            }
            // Obtener la ruta de la carpeta temporal en el servidor
            string folderPath = Server.MapPath("~/TempFiles");
            string fileName = "Factura.pdf";

            // Crear la carpeta si no existe
            System.IO.Directory.CreateDirectory(folderPath);

            // Combinar la ruta de la carpeta y el nombre del archivo para obtener la ruta completa del archivo
            string filePath = Path.Combine(folderPath, fileName);

            // Guardar los bytes en un archivo temporal en el servidor
            System.IO.File.WriteAllBytes(filePath, pdfBytes);

            // Obtener la ruta virtual del archivo
            string virtualPath = Url.Content("~/TempFiles/" + fileName);

            // Devolver la ruta virtual del archivo
            return virtualPath;
        }
        private byte[] GetXmlBytes()
        {
            return xmlBytes;
        }

        private byte[] GetCdrBytes()
        {
            return cdrBytes;
        }

        private byte[] GetPdfBytes()
        {
            return pdfBytes;
        }

        private string GetPdfNombre()
        {
            return pdfNombre;
        }

        private string GetXmlNombre()
        {
            return xmlNombre;
        }

        private string GetCdrNombre()
        {
            return cdrNombre;
        }

        public FileResult DownloadXML()
        {
            // Obtener los bytes del archivo XML
            byte[] xmlBytes = GetXmlBytes(); // Reemplaza esta línea con la forma en que obtienes los bytes del archivo XML
            string nombreArchivo = GetXmlNombre() + ".xml";

            // Devolver el archivo XML como una descarga
            return File(xmlBytes, "application/xml", nombreArchivo);
        }
        public FileResult DownloadCDR()
        {
            // Obtener los bytes del archivo XML
            byte[] cdrBytes = GetCdrBytes(); // Reemplaza esta línea con la forma en que obtienes los bytes del archivo XML
            string nombreArchivo = GetCdrNombre() + ".xml";

            // Devolver el archivo XML como una descarga
            return File(cdrBytes, "application/xml", nombreArchivo);
        }

        public FileResult DownloadPDF()
        {
            // Obtener los bytes del archivo XML
            byte[] pdfBytes = GetPdfBytes(); // Reemplaza esta línea con la forma en que obtienes los bytes del archivo XML
            string nombreArchivo = GetPdfNombre() + ".pdf";

            // Devolver el archivo XML como una descarga
            return File(pdfBytes, "application/pdf", nombreArchivo);
        }
        public ActionResult VistaPDF()
        {
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}