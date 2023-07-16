using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System_Fac.APP_Code
{
    public static class HtmlExtensions
    {
        public static MvcHtmlString Selected(this HtmlHelper htmlHelper, string value, string optionValue)
        {
            return value == optionValue
                ? new MvcHtmlString("selected=\"selected\"")
                : MvcHtmlString.Empty;
        }
    }
}