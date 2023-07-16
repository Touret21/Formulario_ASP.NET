using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System_Fac.Models
{
    public class FormularioViewModel
    {
        public string RUC { get; set; }
        public string Tipo { get; set; }
        public string Folio { get; set; }
        public string Fecha { get; set; }
        public string MontoTotal { get; set; }
        public string ErrorMessage { get; set; }
    }
}