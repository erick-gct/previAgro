'use client';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

  // Descripciones personalizadas por mes
const monthDescriptions: Record<string, string> = {
  enero: 'En Enero de 2024, el lugar donde más llovió fue cerca de la latitud -0.00 y longitud -80.00, con una precipitación de alrededor de 953.00 mm por día en ese mes.',
  febrero: 'En Febrero de 2024, el lugar donde más llovió fue cerca de la latitud -2.50 y longitud -80.62, con una precipitación de alrededor de 991.00 mm por día en ese mes.',
  marzo: 'En Marzo de 2024, el lugar donde más llovió fue cerca de la latitud -0.00 y longitud -79.38, con una precipitación de alrededor de 812.00 mm por día en ese mes.',
  abril: 'En Abril de 2024, el lugar donde más llovió fue cerca de la latitud -0.00 y longitud -79.38, con una precipitación de alrededor de 795.00 mm por día en ese mes.',
  may: 'En Mayo de 2024, el lugar donde más llovió fue cerca de la latitud -0.50 y longitud -79.38, con una precipitación de alrededor de 419.00 mm por día en ese mes.',
  jun: 'En Junio de 2024, el lugar donde más llovió fue cerca de la latitud -0.50 y longitud -79.38, con una precipitación de alrededor de 438.00 mm por día en ese mes.',
  julio: 'En Julio de 2024, el lugar donde más llovió fue cerca de la latitud 1.50 y longitud -79.38, con una precipitación de alrededor de 137.00 mm por día en ese mes.',
  agosto: 'En Agosto de 2024, el lugar donde más llovió fue cerca de la latitud 1.50 y longitud -79.38, con una precipitación de alrededor de 0.84 mm por día en ese mes.',
  sep: 'En Septiembre de 2024, el lugar donde más llovió fue cerca de la latitud -3.50 y longitud -79.38, con una precipitación de alrededor de 105.00 mm por día en ese mes.',
  oct: 'En Octubre de 2024, el lugar donde más llovió fue cerca de la latitud -4.00 y longitud -79.38, con una precipitación de alrededor de 167.00 mm por día en ese mes.',
  nov: 'En Noviembre de 2024, el lugar donde más llovió fue cerca de la latitud -1.00 y longitud -79.38, con una precipitación de alrededor de 116.00 mm por día en ese mes.',
  dic: 'En Diciembre de 2024, el lugar donde más llovió fue cerca de la latitud -0.00 y longitud -79.38, con una precipitación de alrededor de 392.00 mm por día en ese mes.'
};


export default function InfoHistorica() {

  /* const months = [
    'enero', 'febrero', 'marzo', 'abril', 'may', 'jun',
    'julio', 'agosto', 'sep', 'oct', 'nov', 'dic'
  ];
 */

  const months = Object.keys(monthDescriptions);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-5xl w-full space-y-8">
        {/* Título principal */}
        <h1 className="text-green-600 text-3xl font-bold">
          Info histórica de las últimas precipitaciones
        </h1>

        {/* Párrafo introductorio */}
        <p className="text-gray-700">
          Nuestro sistema usa información de las últimas precipitaciones por meses de acuerdo a los últimos años (a partir de 2020) con el que hemos generado la siguiente información gráfica para usted:
        </p>

        {/* Subtítulo: recopilación */}
        <h2 className="text-green-600 text-2xl font-semibold py-6">
          Recopilación de lluvias de todos los años
        </h2>

        {/* Imágenes con descripción */}
        <div className="space-y-6">
          <div className="flex flex-col items-center py-8">
            <img src="/assets/predicciones_meses/precipitacion_anos_1.png" alt="Lluvias generales" className="w-full items-center  rounded-lg shadow md:w-3/4 mb-4" />
            <p className="text-gray-600 text-center max-w-3xl  ">
              En este gráfico, muestra la variación de la precipitación promedio a lo largo de los meses para cada año entre 2020 y 2024 (excluyendo 2025). Se puede apreciar las tendencias estacionales dentro de cada año, identificando qué meses tienden a ser más lluviosos o secos.
            </p>
          </div>
          <div className="flex flex-col items-center py-8">
            <img src="/assets/predicciones_meses/precipitacion_anos_promedio.png" alt="Lluvias acumuladas" className="w-full md:w-3/4 rounded-lg shadow mb-4" />
            <p className="text-gray-600 text-center max-w-3xl">
              En este gráfico, se compara la precipitación anual promedio para cada año entre 2020 y 2024. Este gráfico te permite ver la cantidad total de lluvia que cayó en promedio en cada uno de esos años.
            </p>
          </div>
        </div>

        {/* Subtítulo: análisis mensual */}
        <h2 className="text-green-600 text-2xl font-semibold text-center">
          Análisis de cantidad de lluvia caída por meses del último año (2024)
        </h2>

        {/* Acordeón mensual */}
        <div className="space-y-6">
          {months.map((mes) => (
            <Disclosure as="div" key={mes} className="border rounded-lg">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-3 bg-gray-100 rounded-t-lg hover:bg-gray-200 focus:outline-none">
                    <span className="font-medium text-gray-800 capitalize">{mes}</span>
                    <ChevronUpIcon
                      className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-green-600 transition-transform`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-6 bg-white rounded-b-lg">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={`/assets/predicciones_meses/${mes}.png`}
                        alt={`Lluvias ${mes}`}
                        className="w-full md:w-1/4 rounded-md shadow"
                      />
                      <p className="text-gray-600 text-center max-w-3xl">
                        {monthDescriptions[mes]}
                      </p>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
        
      </div>
    </div>
      
  
  );
}