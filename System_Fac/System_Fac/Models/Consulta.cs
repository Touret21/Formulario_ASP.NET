using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System_Fac.Models
{
    public class Consulta
    {
        public Consulta()
        {
        }

        public Consulta(string token, string ruc, string tipoDocumento, string numeroDocumento, string fechaEmision, string monto)
        {
            this.token = token;
            this.ruc = ruc;
            this.tipoDocumento = tipoDocumento;
            this.numeroDocumento = numeroDocumento;
            this.fechaEmision = fechaEmision;
            this.monto = monto;
        }
        public string token { get; set; }
        public string ruc { get; set; }
        public string tipoDocumento { get; set; }
        public string numeroDocumento { get; set; }
        public string fechaEmision { get; set; }
        public string monto { get; set; }
    }
}