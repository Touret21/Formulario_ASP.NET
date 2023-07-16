using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System_Fac.Models
{
    public class DBApi
    {
        public dynamic Post(string url, string json, string autorizacion = null)
        {
            var client = new RestClient(url);
            var request = new RestRequest();
            request.Method = Method.POST;
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", json,
                ParameterType.RequestBody);

            if (autorizacion != null)
            {
                request.AddHeader("Authorization", autorizacion);

            }


            var response = client.Execute(request);


            dynamic datos = JsonConvert.DeserializeObject(response.Content);

            return datos;
        }
    }
}