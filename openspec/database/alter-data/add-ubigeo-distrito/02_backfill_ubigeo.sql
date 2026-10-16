-- add-ubigeo-distrito - 02 - backfill solo tripletas exactas (ambas fuentes coinciden)
-- Fuentes: INEI 2025 (yull23/ubigeos_peru) x CONCYTEC equivalencias (columna SUNAT).
-- Idempotente: solo toca WHERE ubigeo IS NULL. Generado 2026-10-15.
-- Los no incluidos van en pendientes-conciliacion.md (resolver manual, nada inventado).
UPDATE public.distrito SET ubigeo = '110101' WHERE id_distrito = 1 AND ubigeo IS NULL; -- ICA / ICA / ICA
UPDATE public.distrito SET ubigeo = '110106' WHERE id_distrito = 3 AND ubigeo IS NULL; -- ICA / ICA / PARCONA
UPDATE public.distrito SET ubigeo = '110112' WHERE id_distrito = 4 AND ubigeo IS NULL; -- ICA / ICA / SUBTANJALLA
UPDATE public.distrito SET ubigeo = '110110' WHERE id_distrito = 5 AND ubigeo IS NULL; -- ICA / ICA / SAN JUAN BAUTISTA
UPDATE public.distrito SET ubigeo = '110201' WHERE id_distrito = 6 AND ubigeo IS NULL; -- ICA / CHINCHA / CHINCHA ALTA
UPDATE public.distrito SET ubigeo = '110501' WHERE id_distrito = 7 AND ubigeo IS NULL; -- ICA / PISCO / PISCO
UPDATE public.distrito SET ubigeo = '150122' WHERE id_distrito = 8 AND ubigeo IS NULL; -- LIMA / LIMA / MIRAFLORES
UPDATE public.distrito SET ubigeo = '010101' WHERE id_distrito = 9 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / CHACHAPOYAS
UPDATE public.distrito SET ubigeo = '010102' WHERE id_distrito = 10 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / ASUNCION
UPDATE public.distrito SET ubigeo = '010103' WHERE id_distrito = 11 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / BALSAS
UPDATE public.distrito SET ubigeo = '010104' WHERE id_distrito = 12 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / CHETO
UPDATE public.distrito SET ubigeo = '010105' WHERE id_distrito = 13 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / CHILIQUIN
UPDATE public.distrito SET ubigeo = '010106' WHERE id_distrito = 14 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / CHUQUIBAMBA
UPDATE public.distrito SET ubigeo = '010107' WHERE id_distrito = 15 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / GRANADA
UPDATE public.distrito SET ubigeo = '010108' WHERE id_distrito = 16 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / HUANCAS
UPDATE public.distrito SET ubigeo = '010109' WHERE id_distrito = 17 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / LA JALCA
UPDATE public.distrito SET ubigeo = '010110' WHERE id_distrito = 18 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / LEIMEBAMBA
UPDATE public.distrito SET ubigeo = '010111' WHERE id_distrito = 19 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / LEVANTO
UPDATE public.distrito SET ubigeo = '010112' WHERE id_distrito = 20 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / MAGDALENA
UPDATE public.distrito SET ubigeo = '010113' WHERE id_distrito = 21 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / MARISCAL CASTILLA
UPDATE public.distrito SET ubigeo = '010114' WHERE id_distrito = 22 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / MOLINOPAMPA
UPDATE public.distrito SET ubigeo = '010115' WHERE id_distrito = 23 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / MONTEVIDEO
UPDATE public.distrito SET ubigeo = '010116' WHERE id_distrito = 24 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / OLLEROS
UPDATE public.distrito SET ubigeo = '010117' WHERE id_distrito = 25 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / QUINJALCA
UPDATE public.distrito SET ubigeo = '010118' WHERE id_distrito = 26 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / SAN FRANCISCO DE DAGUAS
UPDATE public.distrito SET ubigeo = '010119' WHERE id_distrito = 27 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / SAN ISIDRO DE MAINO
UPDATE public.distrito SET ubigeo = '010120' WHERE id_distrito = 28 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / SOLOCO
UPDATE public.distrito SET ubigeo = '010121' WHERE id_distrito = 29 AND ubigeo IS NULL; -- AMAZONAS / CHACHAPOYAS / SONCHE
UPDATE public.distrito SET ubigeo = '010201' WHERE id_distrito = 30 AND ubigeo IS NULL; -- AMAZONAS / BAGUA / BAGUA
UPDATE public.distrito SET ubigeo = '010202' WHERE id_distrito = 31 AND ubigeo IS NULL; -- AMAZONAS / BAGUA / ARAMANGO
UPDATE public.distrito SET ubigeo = '010203' WHERE id_distrito = 32 AND ubigeo IS NULL; -- AMAZONAS / BAGUA / COPALLIN
UPDATE public.distrito SET ubigeo = '010204' WHERE id_distrito = 33 AND ubigeo IS NULL; -- AMAZONAS / BAGUA / EL PARCO
UPDATE public.distrito SET ubigeo = '010205' WHERE id_distrito = 34 AND ubigeo IS NULL; -- AMAZONAS / BAGUA / IMAZA
UPDATE public.distrito SET ubigeo = '010206' WHERE id_distrito = 35 AND ubigeo IS NULL; -- AMAZONAS / BAGUA / LA PECA
UPDATE public.distrito SET ubigeo = '010301' WHERE id_distrito = 36 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / JUMBILLA
UPDATE public.distrito SET ubigeo = '010302' WHERE id_distrito = 37 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / CHISQUILLA
UPDATE public.distrito SET ubigeo = '010303' WHERE id_distrito = 38 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / CHURUJA
UPDATE public.distrito SET ubigeo = '010304' WHERE id_distrito = 39 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / COROSHA
UPDATE public.distrito SET ubigeo = '010305' WHERE id_distrito = 40 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / CUISPES
UPDATE public.distrito SET ubigeo = '010306' WHERE id_distrito = 41 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / FLORIDA
UPDATE public.distrito SET ubigeo = '010307' WHERE id_distrito = 42 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / JAZAN
UPDATE public.distrito SET ubigeo = '010308' WHERE id_distrito = 43 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / RECTA
UPDATE public.distrito SET ubigeo = '010309' WHERE id_distrito = 44 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / SAN CARLOS
UPDATE public.distrito SET ubigeo = '010310' WHERE id_distrito = 45 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / SHIPASBAMBA
UPDATE public.distrito SET ubigeo = '010311' WHERE id_distrito = 46 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / VALERA
UPDATE public.distrito SET ubigeo = '010312' WHERE id_distrito = 47 AND ubigeo IS NULL; -- AMAZONAS / BONGARA / YAMBRASBAMBA
UPDATE public.distrito SET ubigeo = '010401' WHERE id_distrito = 48 AND ubigeo IS NULL; -- AMAZONAS / CONDORCANQUI / NIEVA
UPDATE public.distrito SET ubigeo = '010402' WHERE id_distrito = 49 AND ubigeo IS NULL; -- AMAZONAS / CONDORCANQUI / EL CENEPA
UPDATE public.distrito SET ubigeo = '010403' WHERE id_distrito = 50 AND ubigeo IS NULL; -- AMAZONAS / CONDORCANQUI / RIO SANTIAGO
UPDATE public.distrito SET ubigeo = '010501' WHERE id_distrito = 51 AND ubigeo IS NULL; -- AMAZONAS / LUYA / LAMUD
UPDATE public.distrito SET ubigeo = '010502' WHERE id_distrito = 52 AND ubigeo IS NULL; -- AMAZONAS / LUYA / CAMPORREDONDO
UPDATE public.distrito SET ubigeo = '010503' WHERE id_distrito = 53 AND ubigeo IS NULL; -- AMAZONAS / LUYA / COCABAMBA
UPDATE public.distrito SET ubigeo = '010504' WHERE id_distrito = 54 AND ubigeo IS NULL; -- AMAZONAS / LUYA / COLCAMAR
UPDATE public.distrito SET ubigeo = '010505' WHERE id_distrito = 55 AND ubigeo IS NULL; -- AMAZONAS / LUYA / CONILA
UPDATE public.distrito SET ubigeo = '010506' WHERE id_distrito = 56 AND ubigeo IS NULL; -- AMAZONAS / LUYA / INGUILPATA
UPDATE public.distrito SET ubigeo = '010507' WHERE id_distrito = 57 AND ubigeo IS NULL; -- AMAZONAS / LUYA / LONGUITA
UPDATE public.distrito SET ubigeo = '010508' WHERE id_distrito = 58 AND ubigeo IS NULL; -- AMAZONAS / LUYA / LONYA CHICO
UPDATE public.distrito SET ubigeo = '010509' WHERE id_distrito = 59 AND ubigeo IS NULL; -- AMAZONAS / LUYA / LUYA
UPDATE public.distrito SET ubigeo = '010510' WHERE id_distrito = 60 AND ubigeo IS NULL; -- AMAZONAS / LUYA / LUYA VIEJO
UPDATE public.distrito SET ubigeo = '010511' WHERE id_distrito = 61 AND ubigeo IS NULL; -- AMAZONAS / LUYA / MARIA
UPDATE public.distrito SET ubigeo = '010512' WHERE id_distrito = 62 AND ubigeo IS NULL; -- AMAZONAS / LUYA / OCALLI
UPDATE public.distrito SET ubigeo = '010513' WHERE id_distrito = 63 AND ubigeo IS NULL; -- AMAZONAS / LUYA / OCUMAL
UPDATE public.distrito SET ubigeo = '010514' WHERE id_distrito = 64 AND ubigeo IS NULL; -- AMAZONAS / LUYA / PISUQUIA
UPDATE public.distrito SET ubigeo = '010515' WHERE id_distrito = 65 AND ubigeo IS NULL; -- AMAZONAS / LUYA / PROVIDENCIA
UPDATE public.distrito SET ubigeo = '010516' WHERE id_distrito = 66 AND ubigeo IS NULL; -- AMAZONAS / LUYA / SAN CRISTOBAL
UPDATE public.distrito SET ubigeo = '010517' WHERE id_distrito = 67 AND ubigeo IS NULL; -- AMAZONAS / LUYA / SAN FRANCISCO DEL YESO
UPDATE public.distrito SET ubigeo = '010518' WHERE id_distrito = 68 AND ubigeo IS NULL; -- AMAZONAS / LUYA / SAN JERONIMO
UPDATE public.distrito SET ubigeo = '010519' WHERE id_distrito = 69 AND ubigeo IS NULL; -- AMAZONAS / LUYA / SAN JUAN DE LOPECANCHA
UPDATE public.distrito SET ubigeo = '010520' WHERE id_distrito = 70 AND ubigeo IS NULL; -- AMAZONAS / LUYA / SANTA CATALINA
UPDATE public.distrito SET ubigeo = '010521' WHERE id_distrito = 71 AND ubigeo IS NULL; -- AMAZONAS / LUYA / SANTO TOMAS
UPDATE public.distrito SET ubigeo = '010522' WHERE id_distrito = 72 AND ubigeo IS NULL; -- AMAZONAS / LUYA / TINGO
UPDATE public.distrito SET ubigeo = '010523' WHERE id_distrito = 73 AND ubigeo IS NULL; -- AMAZONAS / LUYA / TRITA
UPDATE public.distrito SET ubigeo = '010601' WHERE id_distrito = 74 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / SAN NICOLAS
UPDATE public.distrito SET ubigeo = '010602' WHERE id_distrito = 75 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / CHIRIMOTO
UPDATE public.distrito SET ubigeo = '010603' WHERE id_distrito = 76 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / COCHAMAL
UPDATE public.distrito SET ubigeo = '010604' WHERE id_distrito = 77 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / HUAMBO
UPDATE public.distrito SET ubigeo = '010605' WHERE id_distrito = 78 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / LIMABAMBA
UPDATE public.distrito SET ubigeo = '010606' WHERE id_distrito = 79 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / LONGAR
UPDATE public.distrito SET ubigeo = '010607' WHERE id_distrito = 80 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / MARISCAL BENAVIDES
UPDATE public.distrito SET ubigeo = '010608' WHERE id_distrito = 81 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / MILPUC
UPDATE public.distrito SET ubigeo = '010609' WHERE id_distrito = 82 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / OMIA
UPDATE public.distrito SET ubigeo = '010610' WHERE id_distrito = 83 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / SANTA ROSA
UPDATE public.distrito SET ubigeo = '010611' WHERE id_distrito = 84 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / TOTORA
UPDATE public.distrito SET ubigeo = '010612' WHERE id_distrito = 85 AND ubigeo IS NULL; -- AMAZONAS / RODRIGUEZ DE MENDOZA / VISTA ALEGRE
UPDATE public.distrito SET ubigeo = '010701' WHERE id_distrito = 86 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / BAGUA GRANDE
UPDATE public.distrito SET ubigeo = '010702' WHERE id_distrito = 87 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / CAJARURO
UPDATE public.distrito SET ubigeo = '010703' WHERE id_distrito = 88 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / CUMBA
UPDATE public.distrito SET ubigeo = '010704' WHERE id_distrito = 89 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / EL MILAGRO
UPDATE public.distrito SET ubigeo = '010705' WHERE id_distrito = 90 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / JAMALCA
UPDATE public.distrito SET ubigeo = '010706' WHERE id_distrito = 91 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / LONYA GRANDE
UPDATE public.distrito SET ubigeo = '010707' WHERE id_distrito = 92 AND ubigeo IS NULL; -- AMAZONAS / UTCUBAMBA / YAMON
UPDATE public.distrito SET ubigeo = '020101' WHERE id_distrito = 93 AND ubigeo IS NULL; -- ANCASH / HUARAZ / HUARAZ
UPDATE public.distrito SET ubigeo = '020102' WHERE id_distrito = 94 AND ubigeo IS NULL; -- ANCASH / HUARAZ / COCHABAMBA
UPDATE public.distrito SET ubigeo = '020103' WHERE id_distrito = 95 AND ubigeo IS NULL; -- ANCASH / HUARAZ / COLCABAMBA
UPDATE public.distrito SET ubigeo = '020104' WHERE id_distrito = 96 AND ubigeo IS NULL; -- ANCASH / HUARAZ / HUANCHAY
UPDATE public.distrito SET ubigeo = '020105' WHERE id_distrito = 97 AND ubigeo IS NULL; -- ANCASH / HUARAZ / INDEPENDENCIA
UPDATE public.distrito SET ubigeo = '020106' WHERE id_distrito = 98 AND ubigeo IS NULL; -- ANCASH / HUARAZ / JANGAS
UPDATE public.distrito SET ubigeo = '020107' WHERE id_distrito = 99 AND ubigeo IS NULL; -- ANCASH / HUARAZ / LA LIBERTAD
UPDATE public.distrito SET ubigeo = '020108' WHERE id_distrito = 100 AND ubigeo IS NULL; -- ANCASH / HUARAZ / OLLEROS
UPDATE public.distrito SET ubigeo = '020110' WHERE id_distrito = 102 AND ubigeo IS NULL; -- ANCASH / HUARAZ / PARIACOTO
UPDATE public.distrito SET ubigeo = '020111' WHERE id_distrito = 103 AND ubigeo IS NULL; -- ANCASH / HUARAZ / PIRA
UPDATE public.distrito SET ubigeo = '020112' WHERE id_distrito = 104 AND ubigeo IS NULL; -- ANCASH / HUARAZ / TARICA
UPDATE public.distrito SET ubigeo = '020201' WHERE id_distrito = 105 AND ubigeo IS NULL; -- ANCASH / AIJA / AIJA
UPDATE public.distrito SET ubigeo = '020202' WHERE id_distrito = 106 AND ubigeo IS NULL; -- ANCASH / AIJA / CORIS
UPDATE public.distrito SET ubigeo = '020203' WHERE id_distrito = 107 AND ubigeo IS NULL; -- ANCASH / AIJA / HUACLLAN
UPDATE public.distrito SET ubigeo = '020204' WHERE id_distrito = 108 AND ubigeo IS NULL; -- ANCASH / AIJA / LA MERCED
UPDATE public.distrito SET ubigeo = '020205' WHERE id_distrito = 109 AND ubigeo IS NULL; -- ANCASH / AIJA / SUCCHA
UPDATE public.distrito SET ubigeo = '020301' WHERE id_distrito = 110 AND ubigeo IS NULL; -- ANCASH / ANTONIO RAYMONDI / LLAMELLIN
UPDATE public.distrito SET ubigeo = '020302' WHERE id_distrito = 111 AND ubigeo IS NULL; -- ANCASH / ANTONIO RAYMONDI / ACZO
UPDATE public.distrito SET ubigeo = '020303' WHERE id_distrito = 112 AND ubigeo IS NULL; -- ANCASH / ANTONIO RAYMONDI / CHACCHO
UPDATE public.distrito SET ubigeo = '020304' WHERE id_distrito = 113 AND ubigeo IS NULL; -- ANCASH / ANTONIO RAYMONDI / CHINGAS
UPDATE public.distrito SET ubigeo = '020305' WHERE id_distrito = 114 AND ubigeo IS NULL; -- ANCASH / ANTONIO RAYMONDI / MIRGAS
UPDATE public.distrito SET ubigeo = '020306' WHERE id_distrito = 115 AND ubigeo IS NULL; -- ANCASH / ANTONIO RAYMONDI / SAN JUAN DE RONTOY
UPDATE public.distrito SET ubigeo = '020401' WHERE id_distrito = 116 AND ubigeo IS NULL; -- ANCASH / ASUNCION / CHACAS
UPDATE public.distrito SET ubigeo = '020402' WHERE id_distrito = 117 AND ubigeo IS NULL; -- ANCASH / ASUNCION / ACOCHACA
UPDATE public.distrito SET ubigeo = '020501' WHERE id_distrito = 118 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / CHIQUIAN
UPDATE public.distrito SET ubigeo = '020502' WHERE id_distrito = 119 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / ABELARDO PARDO LEZAMETA
UPDATE public.distrito SET ubigeo = '020503' WHERE id_distrito = 120 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / ANTONIO RAYMONDI
UPDATE public.distrito SET ubigeo = '020504' WHERE id_distrito = 121 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / AQUIA
UPDATE public.distrito SET ubigeo = '020505' WHERE id_distrito = 122 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / CAJACAY
UPDATE public.distrito SET ubigeo = '020506' WHERE id_distrito = 123 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / CANIS
UPDATE public.distrito SET ubigeo = '020507' WHERE id_distrito = 124 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / COLQUIOC
UPDATE public.distrito SET ubigeo = '020508' WHERE id_distrito = 125 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / HUALLANCA
UPDATE public.distrito SET ubigeo = '020509' WHERE id_distrito = 126 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / HUASTA
UPDATE public.distrito SET ubigeo = '020510' WHERE id_distrito = 127 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / HUAYLLACAYAN
UPDATE public.distrito SET ubigeo = '020511' WHERE id_distrito = 128 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / LA PRIMAVERA
UPDATE public.distrito SET ubigeo = '020512' WHERE id_distrito = 129 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / MANGAS
UPDATE public.distrito SET ubigeo = '020513' WHERE id_distrito = 130 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / PACLLON
UPDATE public.distrito SET ubigeo = '020514' WHERE id_distrito = 131 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / SAN MIGUEL DE CORPANQUI
UPDATE public.distrito SET ubigeo = '020515' WHERE id_distrito = 132 AND ubigeo IS NULL; -- ANCASH / BOLOGNESI / TICLLOS
UPDATE public.distrito SET ubigeo = '020601' WHERE id_distrito = 133 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / CARHUAZ
UPDATE public.distrito SET ubigeo = '020602' WHERE id_distrito = 134 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / ACOPAMPA
UPDATE public.distrito SET ubigeo = '020603' WHERE id_distrito = 135 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / AMASHCA
UPDATE public.distrito SET ubigeo = '020604' WHERE id_distrito = 136 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / ANTA
UPDATE public.distrito SET ubigeo = '020605' WHERE id_distrito = 137 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / ATAQUERO
UPDATE public.distrito SET ubigeo = '020606' WHERE id_distrito = 138 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / MARCARA
UPDATE public.distrito SET ubigeo = '020607' WHERE id_distrito = 139 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / PARIAHUANCA
UPDATE public.distrito SET ubigeo = '020608' WHERE id_distrito = 140 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / SAN MIGUEL DE ACO
UPDATE public.distrito SET ubigeo = '020609' WHERE id_distrito = 141 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / SHILLA
UPDATE public.distrito SET ubigeo = '020610' WHERE id_distrito = 142 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / TINCO
UPDATE public.distrito SET ubigeo = '020611' WHERE id_distrito = 143 AND ubigeo IS NULL; -- ANCASH / CARHUAZ / YUNGAR
UPDATE public.distrito SET ubigeo = '020701' WHERE id_distrito = 144 AND ubigeo IS NULL; -- ANCASH / CARLOS FERMIN FITZCARRALD / SAN LUIS
UPDATE public.distrito SET ubigeo = '020702' WHERE id_distrito = 145 AND ubigeo IS NULL; -- ANCASH / CARLOS FERMIN FITZCARRALD / SAN NICOLAS
UPDATE public.distrito SET ubigeo = '020703' WHERE id_distrito = 146 AND ubigeo IS NULL; -- ANCASH / CARLOS FERMIN FITZCARRALD / YAUYA
UPDATE public.distrito SET ubigeo = '020801' WHERE id_distrito = 147 AND ubigeo IS NULL; -- ANCASH / CASMA / CASMA
UPDATE public.distrito SET ubigeo = '020802' WHERE id_distrito = 148 AND ubigeo IS NULL; -- ANCASH / CASMA / BUENA VISTA ALTA
UPDATE public.distrito SET ubigeo = '020803' WHERE id_distrito = 149 AND ubigeo IS NULL; -- ANCASH / CASMA / COMANDANTE NOEL
UPDATE public.distrito SET ubigeo = '020804' WHERE id_distrito = 150 AND ubigeo IS NULL; -- ANCASH / CASMA / YAUTAN
UPDATE public.distrito SET ubigeo = '020901' WHERE id_distrito = 151 AND ubigeo IS NULL; -- ANCASH / CORONGO / CORONGO
UPDATE public.distrito SET ubigeo = '020902' WHERE id_distrito = 152 AND ubigeo IS NULL; -- ANCASH / CORONGO / ACO
UPDATE public.distrito SET ubigeo = '020903' WHERE id_distrito = 153 AND ubigeo IS NULL; -- ANCASH / CORONGO / BAMBAS
UPDATE public.distrito SET ubigeo = '020904' WHERE id_distrito = 154 AND ubigeo IS NULL; -- ANCASH / CORONGO / CUSCA
UPDATE public.distrito SET ubigeo = '020905' WHERE id_distrito = 155 AND ubigeo IS NULL; -- ANCASH / CORONGO / LA PAMPA
UPDATE public.distrito SET ubigeo = '020906' WHERE id_distrito = 156 AND ubigeo IS NULL; -- ANCASH / CORONGO / YANAC
UPDATE public.distrito SET ubigeo = '020907' WHERE id_distrito = 157 AND ubigeo IS NULL; -- ANCASH / CORONGO / YUPAN
UPDATE public.distrito SET ubigeo = '021001' WHERE id_distrito = 158 AND ubigeo IS NULL; -- ANCASH / HUARI / HUARI
UPDATE public.distrito SET ubigeo = '021002' WHERE id_distrito = 159 AND ubigeo IS NULL; -- ANCASH / HUARI / ANRA
UPDATE public.distrito SET ubigeo = '021003' WHERE id_distrito = 160 AND ubigeo IS NULL; -- ANCASH / HUARI / CAJAY
UPDATE public.distrito SET ubigeo = '021004' WHERE id_distrito = 161 AND ubigeo IS NULL; -- ANCASH / HUARI / CHAVIN DE HUANTAR
UPDATE public.distrito SET ubigeo = '021005' WHERE id_distrito = 162 AND ubigeo IS NULL; -- ANCASH / HUARI / HUACACHI
UPDATE public.distrito SET ubigeo = '021006' WHERE id_distrito = 163 AND ubigeo IS NULL; -- ANCASH / HUARI / HUACCHIS
UPDATE public.distrito SET ubigeo = '021007' WHERE id_distrito = 164 AND ubigeo IS NULL; -- ANCASH / HUARI / HUACHIS
UPDATE public.distrito SET ubigeo = '021008' WHERE id_distrito = 165 AND ubigeo IS NULL; -- ANCASH / HUARI / HUANTAR
UPDATE public.distrito SET ubigeo = '021009' WHERE id_distrito = 166 AND ubigeo IS NULL; -- ANCASH / HUARI / MASIN
UPDATE public.distrito SET ubigeo = '021010' WHERE id_distrito = 167 AND ubigeo IS NULL; -- ANCASH / HUARI / PAUCAS
UPDATE public.distrito SET ubigeo = '021011' WHERE id_distrito = 168 AND ubigeo IS NULL; -- ANCASH / HUARI / PONTO
UPDATE public.distrito SET ubigeo = '021012' WHERE id_distrito = 169 AND ubigeo IS NULL; -- ANCASH / HUARI / RAHUAPAMPA
UPDATE public.distrito SET ubigeo = '021013' WHERE id_distrito = 170 AND ubigeo IS NULL; -- ANCASH / HUARI / RAPAYAN
UPDATE public.distrito SET ubigeo = '021014' WHERE id_distrito = 171 AND ubigeo IS NULL; -- ANCASH / HUARI / SAN MARCOS
UPDATE public.distrito SET ubigeo = '021015' WHERE id_distrito = 172 AND ubigeo IS NULL; -- ANCASH / HUARI / SAN PEDRO DE CHANA
UPDATE public.distrito SET ubigeo = '021016' WHERE id_distrito = 173 AND ubigeo IS NULL; -- ANCASH / HUARI / UCO
UPDATE public.distrito SET ubigeo = '021101' WHERE id_distrito = 174 AND ubigeo IS NULL; -- ANCASH / HUARMEY / HUARMEY
UPDATE public.distrito SET ubigeo = '021102' WHERE id_distrito = 175 AND ubigeo IS NULL; -- ANCASH / HUARMEY / COCHAPETI
UPDATE public.distrito SET ubigeo = '021103' WHERE id_distrito = 176 AND ubigeo IS NULL; -- ANCASH / HUARMEY / CULEBRAS
UPDATE public.distrito SET ubigeo = '021104' WHERE id_distrito = 177 AND ubigeo IS NULL; -- ANCASH / HUARMEY / HUAYAN
UPDATE public.distrito SET ubigeo = '021105' WHERE id_distrito = 178 AND ubigeo IS NULL; -- ANCASH / HUARMEY / MALVAS
UPDATE public.distrito SET ubigeo = '021201' WHERE id_distrito = 179 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / CARAZ
UPDATE public.distrito SET ubigeo = '021202' WHERE id_distrito = 180 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / HUALLANCA
UPDATE public.distrito SET ubigeo = '021203' WHERE id_distrito = 181 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / HUATA
UPDATE public.distrito SET ubigeo = '021204' WHERE id_distrito = 182 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / HUAYLAS
UPDATE public.distrito SET ubigeo = '021205' WHERE id_distrito = 183 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / MATO
UPDATE public.distrito SET ubigeo = '021206' WHERE id_distrito = 184 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / PAMPAROMAS
UPDATE public.distrito SET ubigeo = '021208' WHERE id_distrito = 186 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / SANTA CRUZ
UPDATE public.distrito SET ubigeo = '021209' WHERE id_distrito = 187 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / SANTO TORIBIO
UPDATE public.distrito SET ubigeo = '021210' WHERE id_distrito = 188 AND ubigeo IS NULL; -- ANCASH / HUAYLAS / YURACMARCA
UPDATE public.distrito SET ubigeo = '021301' WHERE id_distrito = 189 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / PISCOBAMBA
UPDATE public.distrito SET ubigeo = '021302' WHERE id_distrito = 190 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / CASCA
UPDATE public.distrito SET ubigeo = '021303' WHERE id_distrito = 191 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / ELEAZAR GUZMAN BARRON
UPDATE public.distrito SET ubigeo = '021304' WHERE id_distrito = 192 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / FIDEL OLIVAS ESCUDERO
UPDATE public.distrito SET ubigeo = '021305' WHERE id_distrito = 193 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / LLAMA
UPDATE public.distrito SET ubigeo = '021306' WHERE id_distrito = 194 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / LLUMPA
UPDATE public.distrito SET ubigeo = '021307' WHERE id_distrito = 195 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / LUCMA
UPDATE public.distrito SET ubigeo = '021308' WHERE id_distrito = 196 AND ubigeo IS NULL; -- ANCASH / MARISCAL LUZURIAGA / MUSGA
UPDATE public.distrito SET ubigeo = '021401' WHERE id_distrito = 197 AND ubigeo IS NULL; -- ANCASH / OCROS / OCROS
UPDATE public.distrito SET ubigeo = '021402' WHERE id_distrito = 198 AND ubigeo IS NULL; -- ANCASH / OCROS / ACAS
UPDATE public.distrito SET ubigeo = '021403' WHERE id_distrito = 199 AND ubigeo IS NULL; -- ANCASH / OCROS / CAJAMARQUILLA
UPDATE public.distrito SET ubigeo = '021404' WHERE id_distrito = 200 AND ubigeo IS NULL; -- ANCASH / OCROS / CARHUAPAMPA
UPDATE public.distrito SET ubigeo = '021405' WHERE id_distrito = 201 AND ubigeo IS NULL; -- ANCASH / OCROS / COCHAS
UPDATE public.distrito SET ubigeo = '021406' WHERE id_distrito = 202 AND ubigeo IS NULL; -- ANCASH / OCROS / CONGAS
UPDATE public.distrito SET ubigeo = '021407' WHERE id_distrito = 203 AND ubigeo IS NULL; -- ANCASH / OCROS / LLIPA
UPDATE public.distrito SET ubigeo = '021408' WHERE id_distrito = 204 AND ubigeo IS NULL; -- ANCASH / OCROS / SAN CRISTOBAL DE RAJAN
UPDATE public.distrito SET ubigeo = '021409' WHERE id_distrito = 205 AND ubigeo IS NULL; -- ANCASH / OCROS / SAN PEDRO
UPDATE public.distrito SET ubigeo = '021410' WHERE id_distrito = 206 AND ubigeo IS NULL; -- ANCASH / OCROS / SANTIAGO DE CHILCAS
UPDATE public.distrito SET ubigeo = '021501' WHERE id_distrito = 207 AND ubigeo IS NULL; -- ANCASH / PALLASCA / CABANA
UPDATE public.distrito SET ubigeo = '021502' WHERE id_distrito = 208 AND ubigeo IS NULL; -- ANCASH / PALLASCA / BOLOGNESI
UPDATE public.distrito SET ubigeo = '021503' WHERE id_distrito = 209 AND ubigeo IS NULL; -- ANCASH / PALLASCA / CONCHUCOS
UPDATE public.distrito SET ubigeo = '021504' WHERE id_distrito = 210 AND ubigeo IS NULL; -- ANCASH / PALLASCA / HUACASCHUQUE
UPDATE public.distrito SET ubigeo = '021505' WHERE id_distrito = 211 AND ubigeo IS NULL; -- ANCASH / PALLASCA / HUANDOVAL
UPDATE public.distrito SET ubigeo = '021506' WHERE id_distrito = 212 AND ubigeo IS NULL; -- ANCASH / PALLASCA / LACABAMBA
UPDATE public.distrito SET ubigeo = '021507' WHERE id_distrito = 213 AND ubigeo IS NULL; -- ANCASH / PALLASCA / LLAPO
UPDATE public.distrito SET ubigeo = '021508' WHERE id_distrito = 214 AND ubigeo IS NULL; -- ANCASH / PALLASCA / PALLASCA
UPDATE public.distrito SET ubigeo = '021509' WHERE id_distrito = 215 AND ubigeo IS NULL; -- ANCASH / PALLASCA / PAMPAS
UPDATE public.distrito SET ubigeo = '021510' WHERE id_distrito = 216 AND ubigeo IS NULL; -- ANCASH / PALLASCA / SANTA ROSA
UPDATE public.distrito SET ubigeo = '021511' WHERE id_distrito = 217 AND ubigeo IS NULL; -- ANCASH / PALLASCA / TAUCA
UPDATE public.distrito SET ubigeo = '021601' WHERE id_distrito = 218 AND ubigeo IS NULL; -- ANCASH / POMABAMBA / POMABAMBA
UPDATE public.distrito SET ubigeo = '021602' WHERE id_distrito = 219 AND ubigeo IS NULL; -- ANCASH / POMABAMBA / HUAYLLAN
UPDATE public.distrito SET ubigeo = '021603' WHERE id_distrito = 220 AND ubigeo IS NULL; -- ANCASH / POMABAMBA / PAROBAMBA
UPDATE public.distrito SET ubigeo = '021604' WHERE id_distrito = 221 AND ubigeo IS NULL; -- ANCASH / POMABAMBA / QUINUABAMBA
UPDATE public.distrito SET ubigeo = '021701' WHERE id_distrito = 222 AND ubigeo IS NULL; -- ANCASH / RECUAY / RECUAY
UPDATE public.distrito SET ubigeo = '021702' WHERE id_distrito = 223 AND ubigeo IS NULL; -- ANCASH / RECUAY / CATAC
UPDATE public.distrito SET ubigeo = '021703' WHERE id_distrito = 224 AND ubigeo IS NULL; -- ANCASH / RECUAY / COTAPARACO
UPDATE public.distrito SET ubigeo = '021704' WHERE id_distrito = 225 AND ubigeo IS NULL; -- ANCASH / RECUAY / HUAYLLAPAMPA
UPDATE public.distrito SET ubigeo = '021705' WHERE id_distrito = 226 AND ubigeo IS NULL; -- ANCASH / RECUAY / LLACLLIN
UPDATE public.distrito SET ubigeo = '021706' WHERE id_distrito = 227 AND ubigeo IS NULL; -- ANCASH / RECUAY / MARCA
UPDATE public.distrito SET ubigeo = '021707' WHERE id_distrito = 228 AND ubigeo IS NULL; -- ANCASH / RECUAY / PAMPAS CHICO
UPDATE public.distrito SET ubigeo = '021708' WHERE id_distrito = 229 AND ubigeo IS NULL; -- ANCASH / RECUAY / PARARIN
UPDATE public.distrito SET ubigeo = '021709' WHERE id_distrito = 230 AND ubigeo IS NULL; -- ANCASH / RECUAY / TAPACOCHA
UPDATE public.distrito SET ubigeo = '021710' WHERE id_distrito = 231 AND ubigeo IS NULL; -- ANCASH / RECUAY / TICAPAMPA
UPDATE public.distrito SET ubigeo = '021801' WHERE id_distrito = 232 AND ubigeo IS NULL; -- ANCASH / SANTA / CHIMBOTE
UPDATE public.distrito SET ubigeo = '021802' WHERE id_distrito = 233 AND ubigeo IS NULL; -- ANCASH / SANTA / CACERES DEL PERU
UPDATE public.distrito SET ubigeo = '021803' WHERE id_distrito = 234 AND ubigeo IS NULL; -- ANCASH / SANTA / COISHCO
UPDATE public.distrito SET ubigeo = '021804' WHERE id_distrito = 235 AND ubigeo IS NULL; -- ANCASH / SANTA / MACATE
UPDATE public.distrito SET ubigeo = '021805' WHERE id_distrito = 236 AND ubigeo IS NULL; -- ANCASH / SANTA / MORO
UPDATE public.distrito SET ubigeo = '021807' WHERE id_distrito = 238 AND ubigeo IS NULL; -- ANCASH / SANTA / SAMANCO
UPDATE public.distrito SET ubigeo = '021808' WHERE id_distrito = 239 AND ubigeo IS NULL; -- ANCASH / SANTA / SANTA
UPDATE public.distrito SET ubigeo = '021809' WHERE id_distrito = 240 AND ubigeo IS NULL; -- ANCASH / SANTA / NUEVO CHIMBOTE
UPDATE public.distrito SET ubigeo = '021901' WHERE id_distrito = 241 AND ubigeo IS NULL; -- ANCASH / SIHUAS / SIHUAS
UPDATE public.distrito SET ubigeo = '021902' WHERE id_distrito = 242 AND ubigeo IS NULL; -- ANCASH / SIHUAS / ACOBAMBA
UPDATE public.distrito SET ubigeo = '021903' WHERE id_distrito = 243 AND ubigeo IS NULL; -- ANCASH / SIHUAS / ALFONSO UGARTE
UPDATE public.distrito SET ubigeo = '021904' WHERE id_distrito = 244 AND ubigeo IS NULL; -- ANCASH / SIHUAS / CASHAPAMPA
UPDATE public.distrito SET ubigeo = '021905' WHERE id_distrito = 245 AND ubigeo IS NULL; -- ANCASH / SIHUAS / CHINGALPO
UPDATE public.distrito SET ubigeo = '021906' WHERE id_distrito = 246 AND ubigeo IS NULL; -- ANCASH / SIHUAS / HUAYLLABAMBA
UPDATE public.distrito SET ubigeo = '021907' WHERE id_distrito = 247 AND ubigeo IS NULL; -- ANCASH / SIHUAS / QUICHES
UPDATE public.distrito SET ubigeo = '021908' WHERE id_distrito = 248 AND ubigeo IS NULL; -- ANCASH / SIHUAS / RAGASH
UPDATE public.distrito SET ubigeo = '021909' WHERE id_distrito = 249 AND ubigeo IS NULL; -- ANCASH / SIHUAS / SAN JUAN
UPDATE public.distrito SET ubigeo = '021910' WHERE id_distrito = 250 AND ubigeo IS NULL; -- ANCASH / SIHUAS / SICSIBAMBA
UPDATE public.distrito SET ubigeo = '022001' WHERE id_distrito = 251 AND ubigeo IS NULL; -- ANCASH / YUNGAY / YUNGAY
UPDATE public.distrito SET ubigeo = '022002' WHERE id_distrito = 252 AND ubigeo IS NULL; -- ANCASH / YUNGAY / CASCAPARA
UPDATE public.distrito SET ubigeo = '022003' WHERE id_distrito = 253 AND ubigeo IS NULL; -- ANCASH / YUNGAY / MANCOS
UPDATE public.distrito SET ubigeo = '022004' WHERE id_distrito = 254 AND ubigeo IS NULL; -- ANCASH / YUNGAY / MATACOTO
UPDATE public.distrito SET ubigeo = '022005' WHERE id_distrito = 255 AND ubigeo IS NULL; -- ANCASH / YUNGAY / QUILLO
UPDATE public.distrito SET ubigeo = '022006' WHERE id_distrito = 256 AND ubigeo IS NULL; -- ANCASH / YUNGAY / RANRAHIRCA
UPDATE public.distrito SET ubigeo = '022007' WHERE id_distrito = 257 AND ubigeo IS NULL; -- ANCASH / YUNGAY / SHUPLUY
UPDATE public.distrito SET ubigeo = '022008' WHERE id_distrito = 258 AND ubigeo IS NULL; -- ANCASH / YUNGAY / YANAMA
UPDATE public.distrito SET ubigeo = '030101' WHERE id_distrito = 259 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / ABANCAY
UPDATE public.distrito SET ubigeo = '030102' WHERE id_distrito = 260 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / CHACOCHE
UPDATE public.distrito SET ubigeo = '030103' WHERE id_distrito = 261 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / CIRCA
UPDATE public.distrito SET ubigeo = '030104' WHERE id_distrito = 262 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / CURAHUASI
UPDATE public.distrito SET ubigeo = '030105' WHERE id_distrito = 263 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / HUANIPACA
UPDATE public.distrito SET ubigeo = '030106' WHERE id_distrito = 264 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / LAMBRAMA
UPDATE public.distrito SET ubigeo = '030107' WHERE id_distrito = 265 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / PICHIRHUA
UPDATE public.distrito SET ubigeo = '030108' WHERE id_distrito = 266 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / SAN PEDRO DE CACHORA
UPDATE public.distrito SET ubigeo = '030109' WHERE id_distrito = 267 AND ubigeo IS NULL; -- APURIMAC / ABANCAY / TAMBURCO
UPDATE public.distrito SET ubigeo = '030201' WHERE id_distrito = 268 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / ANDAHUAYLAS
UPDATE public.distrito SET ubigeo = '030202' WHERE id_distrito = 269 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / ANDARAPA
UPDATE public.distrito SET ubigeo = '030203' WHERE id_distrito = 270 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / CHIARA
UPDATE public.distrito SET ubigeo = '030204' WHERE id_distrito = 271 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / HUANCARAMA
UPDATE public.distrito SET ubigeo = '030205' WHERE id_distrito = 272 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / HUANCARAY
UPDATE public.distrito SET ubigeo = '030206' WHERE id_distrito = 273 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / HUAYANA
UPDATE public.distrito SET ubigeo = '030207' WHERE id_distrito = 274 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / KISHUARA
UPDATE public.distrito SET ubigeo = '030208' WHERE id_distrito = 275 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / PACOBAMBA
UPDATE public.distrito SET ubigeo = '030209' WHERE id_distrito = 276 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / PACUCHA
UPDATE public.distrito SET ubigeo = '030210' WHERE id_distrito = 277 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / PAMPACHIRI
UPDATE public.distrito SET ubigeo = '030211' WHERE id_distrito = 278 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / POMACOCHA
UPDATE public.distrito SET ubigeo = '030212' WHERE id_distrito = 279 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / SAN ANTONIO DE CACHI
UPDATE public.distrito SET ubigeo = '030213' WHERE id_distrito = 280 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / SAN JERONIMO
UPDATE public.distrito SET ubigeo = '030214' WHERE id_distrito = 281 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / SAN MIGUEL DE CHACCRAMPA
UPDATE public.distrito SET ubigeo = '030215' WHERE id_distrito = 282 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / SANTA MARIA DE CHICMO
UPDATE public.distrito SET ubigeo = '030216' WHERE id_distrito = 283 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / TALAVERA
UPDATE public.distrito SET ubigeo = '030217' WHERE id_distrito = 284 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / TUMAY HUARACA
UPDATE public.distrito SET ubigeo = '030218' WHERE id_distrito = 285 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / TURPO
UPDATE public.distrito SET ubigeo = '030219' WHERE id_distrito = 286 AND ubigeo IS NULL; -- APURIMAC / ANDAHUAYLAS / KAQUIABAMBA
UPDATE public.distrito SET ubigeo = '030301' WHERE id_distrito = 288 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / ANTABAMBA
UPDATE public.distrito SET ubigeo = '030302' WHERE id_distrito = 289 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / EL ORO
UPDATE public.distrito SET ubigeo = '030303' WHERE id_distrito = 290 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / HUAQUIRCA
UPDATE public.distrito SET ubigeo = '030304' WHERE id_distrito = 291 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / JUAN ESPINOZA MEDRANO
UPDATE public.distrito SET ubigeo = '030305' WHERE id_distrito = 292 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / OROPESA
UPDATE public.distrito SET ubigeo = '030306' WHERE id_distrito = 293 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / PACHACONAS
UPDATE public.distrito SET ubigeo = '030307' WHERE id_distrito = 294 AND ubigeo IS NULL; -- APURIMAC / ANTABAMBA / SABAINO
UPDATE public.distrito SET ubigeo = '030401' WHERE id_distrito = 295 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / CHALHUANCA
UPDATE public.distrito SET ubigeo = '030402' WHERE id_distrito = 296 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / CAPAYA
UPDATE public.distrito SET ubigeo = '030403' WHERE id_distrito = 297 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / CARAYBAMBA
UPDATE public.distrito SET ubigeo = '030404' WHERE id_distrito = 298 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / CHAPIMARCA
UPDATE public.distrito SET ubigeo = '030405' WHERE id_distrito = 299 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / COLCABAMBA
UPDATE public.distrito SET ubigeo = '030406' WHERE id_distrito = 300 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / COTARUSE
UPDATE public.distrito SET ubigeo = '030408' WHERE id_distrito = 302 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / JUSTO APU SAHUARAURA
UPDATE public.distrito SET ubigeo = '030409' WHERE id_distrito = 303 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / LUCRE
UPDATE public.distrito SET ubigeo = '030410' WHERE id_distrito = 304 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / POCOHUANCA
UPDATE public.distrito SET ubigeo = '030413' WHERE id_distrito = 307 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / SORAYA
UPDATE public.distrito SET ubigeo = '030414' WHERE id_distrito = 308 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / TAPAIRIHUA
UPDATE public.distrito SET ubigeo = '030415' WHERE id_distrito = 309 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / TINTAY
UPDATE public.distrito SET ubigeo = '030416' WHERE id_distrito = 310 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / TORAYA
UPDATE public.distrito SET ubigeo = '030417' WHERE id_distrito = 311 AND ubigeo IS NULL; -- APURIMAC / AYMARAES / YANACA
UPDATE public.distrito SET ubigeo = '030501' WHERE id_distrito = 312 AND ubigeo IS NULL; -- APURIMAC / COTABAMBAS / TAMBOBAMBA
UPDATE public.distrito SET ubigeo = '030502' WHERE id_distrito = 313 AND ubigeo IS NULL; -- APURIMAC / COTABAMBAS / COTABAMBAS
UPDATE public.distrito SET ubigeo = '030503' WHERE id_distrito = 314 AND ubigeo IS NULL; -- APURIMAC / COTABAMBAS / COYLLURQUI
UPDATE public.distrito SET ubigeo = '030504' WHERE id_distrito = 315 AND ubigeo IS NULL; -- APURIMAC / COTABAMBAS / HAQUIRA
UPDATE public.distrito SET ubigeo = '030505' WHERE id_distrito = 316 AND ubigeo IS NULL; -- APURIMAC / COTABAMBAS / MARA
UPDATE public.distrito SET ubigeo = '030506' WHERE id_distrito = 317 AND ubigeo IS NULL; -- APURIMAC / COTABAMBAS / CHALLHUAHUACHO
UPDATE public.distrito SET ubigeo = '030601' WHERE id_distrito = 318 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / CHINCHEROS
UPDATE public.distrito SET ubigeo = '030602' WHERE id_distrito = 319 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / ANCO-HUALLO
UPDATE public.distrito SET ubigeo = '030603' WHERE id_distrito = 320 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / COCHARCAS
UPDATE public.distrito SET ubigeo = '030604' WHERE id_distrito = 321 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / HUACCANA
UPDATE public.distrito SET ubigeo = '030605' WHERE id_distrito = 322 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / OCOBAMBA
UPDATE public.distrito SET ubigeo = '030606' WHERE id_distrito = 323 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / ONGOY
UPDATE public.distrito SET ubigeo = '030607' WHERE id_distrito = 324 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / URANMARCA
UPDATE public.distrito SET ubigeo = '030608' WHERE id_distrito = 325 AND ubigeo IS NULL; -- APURIMAC / CHINCHEROS / RANRACANCHA
UPDATE public.distrito SET ubigeo = '030701' WHERE id_distrito = 330 AND ubigeo IS NULL; -- APURIMAC / GRAU / CHUQUIBAMBILLA
UPDATE public.distrito SET ubigeo = '030702' WHERE id_distrito = 331 AND ubigeo IS NULL; -- APURIMAC / GRAU / CURPAHUASI
UPDATE public.distrito SET ubigeo = '030703' WHERE id_distrito = 332 AND ubigeo IS NULL; -- APURIMAC / GRAU / GAMARRA
UPDATE public.distrito SET ubigeo = '030704' WHERE id_distrito = 333 AND ubigeo IS NULL; -- APURIMAC / GRAU / HUAYLLATI
UPDATE public.distrito SET ubigeo = '030705' WHERE id_distrito = 334 AND ubigeo IS NULL; -- APURIMAC / GRAU / MAMARA
UPDATE public.distrito SET ubigeo = '030706' WHERE id_distrito = 335 AND ubigeo IS NULL; -- APURIMAC / GRAU / MICAELA BASTIDAS
UPDATE public.distrito SET ubigeo = '030707' WHERE id_distrito = 336 AND ubigeo IS NULL; -- APURIMAC / GRAU / PATAYPAMPA
UPDATE public.distrito SET ubigeo = '030708' WHERE id_distrito = 337 AND ubigeo IS NULL; -- APURIMAC / GRAU / PROGRESO
UPDATE public.distrito SET ubigeo = '030709' WHERE id_distrito = 338 AND ubigeo IS NULL; -- APURIMAC / GRAU / SAN ANTONIO
UPDATE public.distrito SET ubigeo = '030710' WHERE id_distrito = 339 AND ubigeo IS NULL; -- APURIMAC / GRAU / SANTA ROSA
UPDATE public.distrito SET ubigeo = '030711' WHERE id_distrito = 340 AND ubigeo IS NULL; -- APURIMAC / GRAU / TURPAY
UPDATE public.distrito SET ubigeo = '030712' WHERE id_distrito = 341 AND ubigeo IS NULL; -- APURIMAC / GRAU / VILCABAMBA
UPDATE public.distrito SET ubigeo = '030713' WHERE id_distrito = 342 AND ubigeo IS NULL; -- APURIMAC / GRAU / VIRUNDO
UPDATE public.distrito SET ubigeo = '030714' WHERE id_distrito = 343 AND ubigeo IS NULL; -- APURIMAC / GRAU / CURASCO
UPDATE public.distrito SET ubigeo = '040101' WHERE id_distrito = 344 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / AREQUIPA
UPDATE public.distrito SET ubigeo = '040102' WHERE id_distrito = 345 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / ALTO SELVA ALEGRE
UPDATE public.distrito SET ubigeo = '040103' WHERE id_distrito = 346 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / CAYMA
UPDATE public.distrito SET ubigeo = '040104' WHERE id_distrito = 347 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / CERRO COLORADO
UPDATE public.distrito SET ubigeo = '040105' WHERE id_distrito = 348 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / CHARACATO
UPDATE public.distrito SET ubigeo = '040106' WHERE id_distrito = 349 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / CHIGUATA
UPDATE public.distrito SET ubigeo = '040107' WHERE id_distrito = 350 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / JACOBO HUNTER
UPDATE public.distrito SET ubigeo = '040108' WHERE id_distrito = 351 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / LA JOYA
UPDATE public.distrito SET ubigeo = '040109' WHERE id_distrito = 352 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / MARIANO MELGAR
UPDATE public.distrito SET ubigeo = '040110' WHERE id_distrito = 353 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / MIRAFLORES
UPDATE public.distrito SET ubigeo = '040111' WHERE id_distrito = 354 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / MOLLEBAYA
UPDATE public.distrito SET ubigeo = '040112' WHERE id_distrito = 355 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / PAUCARPATA
UPDATE public.distrito SET ubigeo = '040113' WHERE id_distrito = 356 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / POCSI
UPDATE public.distrito SET ubigeo = '040114' WHERE id_distrito = 357 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / POLOBAYA
UPDATE public.distrito SET ubigeo = '040116' WHERE id_distrito = 359 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / SABANDIA
UPDATE public.distrito SET ubigeo = '040117' WHERE id_distrito = 360 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / SACHACA
UPDATE public.distrito SET ubigeo = '040119' WHERE id_distrito = 362 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / SAN JUAN DE TARUCANI
UPDATE public.distrito SET ubigeo = '040120' WHERE id_distrito = 363 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / SANTA ISABEL DE SIGUAS
UPDATE public.distrito SET ubigeo = '040121' WHERE id_distrito = 364 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / SANTA RITA DE SIGUAS
UPDATE public.distrito SET ubigeo = '040122' WHERE id_distrito = 365 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / SOCABAYA
UPDATE public.distrito SET ubigeo = '040123' WHERE id_distrito = 366 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / TIABAYA
UPDATE public.distrito SET ubigeo = '040124' WHERE id_distrito = 367 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / UCHUMAYO
UPDATE public.distrito SET ubigeo = '040125' WHERE id_distrito = 368 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / VITOR
UPDATE public.distrito SET ubigeo = '040126' WHERE id_distrito = 369 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / YANAHUARA
UPDATE public.distrito SET ubigeo = '040127' WHERE id_distrito = 370 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / YARABAMBA
UPDATE public.distrito SET ubigeo = '040128' WHERE id_distrito = 371 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / YURA
UPDATE public.distrito SET ubigeo = '040129' WHERE id_distrito = 372 AND ubigeo IS NULL; -- AREQUIPA / AREQUIPA / JOSE LUIS BUSTAMANTE Y RIVERO
UPDATE public.distrito SET ubigeo = '040201' WHERE id_distrito = 373 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / CAMANA
UPDATE public.distrito SET ubigeo = '040202' WHERE id_distrito = 374 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / JOSE MARIA QUIMPER
UPDATE public.distrito SET ubigeo = '040203' WHERE id_distrito = 375 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / MARIANO NICOLAS VALCARCEL
UPDATE public.distrito SET ubigeo = '040204' WHERE id_distrito = 376 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / MARISCAL CACERES
UPDATE public.distrito SET ubigeo = '040205' WHERE id_distrito = 377 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / NICOLAS DE PIEROLA
UPDATE public.distrito SET ubigeo = '040207' WHERE id_distrito = 379 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / QUILCA
UPDATE public.distrito SET ubigeo = '040208' WHERE id_distrito = 380 AND ubigeo IS NULL; -- AREQUIPA / CAMANA / SAMUEL PASTOR
UPDATE public.distrito SET ubigeo = '040301' WHERE id_distrito = 381 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / CARAVELI
UPDATE public.distrito SET ubigeo = '040302' WHERE id_distrito = 382 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / ACARI
UPDATE public.distrito SET ubigeo = '040303' WHERE id_distrito = 383 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / ATICO
UPDATE public.distrito SET ubigeo = '040304' WHERE id_distrito = 384 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / ATIQUIPA
UPDATE public.distrito SET ubigeo = '040305' WHERE id_distrito = 385 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / BELLA UNION
UPDATE public.distrito SET ubigeo = '040306' WHERE id_distrito = 386 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / CAHUACHO
UPDATE public.distrito SET ubigeo = '040307' WHERE id_distrito = 387 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / CHALA
UPDATE public.distrito SET ubigeo = '040308' WHERE id_distrito = 388 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / CHAPARRA
UPDATE public.distrito SET ubigeo = '040309' WHERE id_distrito = 389 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / HUANUHUANU
UPDATE public.distrito SET ubigeo = '040310' WHERE id_distrito = 390 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / JAQUI
UPDATE public.distrito SET ubigeo = '040311' WHERE id_distrito = 391 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / LOMAS
UPDATE public.distrito SET ubigeo = '040312' WHERE id_distrito = 392 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / QUICACHA
UPDATE public.distrito SET ubigeo = '040313' WHERE id_distrito = 393 AND ubigeo IS NULL; -- AREQUIPA / CARAVELI / YAUCA
UPDATE public.distrito SET ubigeo = '040401' WHERE id_distrito = 394 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / APLAO
UPDATE public.distrito SET ubigeo = '040402' WHERE id_distrito = 395 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / ANDAGUA
UPDATE public.distrito SET ubigeo = '040403' WHERE id_distrito = 396 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / AYO
UPDATE public.distrito SET ubigeo = '040404' WHERE id_distrito = 397 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / CHACHAS
UPDATE public.distrito SET ubigeo = '040405' WHERE id_distrito = 398 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / CHILCAYMARCA
UPDATE public.distrito SET ubigeo = '040406' WHERE id_distrito = 399 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / CHOCO
UPDATE public.distrito SET ubigeo = '040407' WHERE id_distrito = 400 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / HUANCARQUI
UPDATE public.distrito SET ubigeo = '040408' WHERE id_distrito = 401 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / MACHAGUAY
UPDATE public.distrito SET ubigeo = '040409' WHERE id_distrito = 402 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / ORCOPAMPA
UPDATE public.distrito SET ubigeo = '040410' WHERE id_distrito = 403 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / PAMPACOLCA
UPDATE public.distrito SET ubigeo = '040411' WHERE id_distrito = 404 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / TIPAN
UPDATE public.distrito SET ubigeo = '040413' WHERE id_distrito = 406 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / URACA
UPDATE public.distrito SET ubigeo = '040414' WHERE id_distrito = 407 AND ubigeo IS NULL; -- AREQUIPA / CASTILLA / VIRACO
UPDATE public.distrito SET ubigeo = '040501' WHERE id_distrito = 408 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / CHIVAY
UPDATE public.distrito SET ubigeo = '040502' WHERE id_distrito = 409 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / ACHOMA
UPDATE public.distrito SET ubigeo = '040503' WHERE id_distrito = 410 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / CABANACONDE
UPDATE public.distrito SET ubigeo = '040504' WHERE id_distrito = 411 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / CALLALLI
UPDATE public.distrito SET ubigeo = '040505' WHERE id_distrito = 412 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / CAYLLOMA
UPDATE public.distrito SET ubigeo = '040506' WHERE id_distrito = 413 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / COPORAQUE
UPDATE public.distrito SET ubigeo = '040507' WHERE id_distrito = 414 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / HUAMBO
UPDATE public.distrito SET ubigeo = '040508' WHERE id_distrito = 415 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / HUANCA
UPDATE public.distrito SET ubigeo = '040509' WHERE id_distrito = 416 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / ICHUPAMPA
UPDATE public.distrito SET ubigeo = '040510' WHERE id_distrito = 417 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / LARI
UPDATE public.distrito SET ubigeo = '040511' WHERE id_distrito = 418 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / LLUTA
UPDATE public.distrito SET ubigeo = '040512' WHERE id_distrito = 419 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / MACA
UPDATE public.distrito SET ubigeo = '040513' WHERE id_distrito = 420 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / MADRIGAL
UPDATE public.distrito SET ubigeo = '040515' WHERE id_distrito = 422 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / SIBAYO
UPDATE public.distrito SET ubigeo = '040516' WHERE id_distrito = 423 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / TAPAY
UPDATE public.distrito SET ubigeo = '040517' WHERE id_distrito = 424 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / TISCO
UPDATE public.distrito SET ubigeo = '040518' WHERE id_distrito = 425 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / TUTI
UPDATE public.distrito SET ubigeo = '040519' WHERE id_distrito = 426 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / YANQUE
UPDATE public.distrito SET ubigeo = '040520' WHERE id_distrito = 427 AND ubigeo IS NULL; -- AREQUIPA / CAYLLOMA / MAJES
UPDATE public.distrito SET ubigeo = '040601' WHERE id_distrito = 428 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / CHUQUIBAMBA
UPDATE public.distrito SET ubigeo = '040602' WHERE id_distrito = 429 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / ANDARAY
UPDATE public.distrito SET ubigeo = '040603' WHERE id_distrito = 430 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / CAYARANI
UPDATE public.distrito SET ubigeo = '040604' WHERE id_distrito = 431 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / CHICHAS
UPDATE public.distrito SET ubigeo = '040605' WHERE id_distrito = 432 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / IRAY
UPDATE public.distrito SET ubigeo = '040606' WHERE id_distrito = 433 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / RIO GRANDE
UPDATE public.distrito SET ubigeo = '040607' WHERE id_distrito = 434 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / SALAMANCA
UPDATE public.distrito SET ubigeo = '040608' WHERE id_distrito = 435 AND ubigeo IS NULL; -- AREQUIPA / CONDESUYOS / YANAQUIHUA
UPDATE public.distrito SET ubigeo = '040701' WHERE id_distrito = 436 AND ubigeo IS NULL; -- AREQUIPA / ISLAY / MOLLENDO
UPDATE public.distrito SET ubigeo = '040702' WHERE id_distrito = 437 AND ubigeo IS NULL; -- AREQUIPA / ISLAY / COCACHACRA
UPDATE public.distrito SET ubigeo = '040703' WHERE id_distrito = 438 AND ubigeo IS NULL; -- AREQUIPA / ISLAY / DEAN VALDIVIA
UPDATE public.distrito SET ubigeo = '040704' WHERE id_distrito = 439 AND ubigeo IS NULL; -- AREQUIPA / ISLAY / ISLAY
UPDATE public.distrito SET ubigeo = '040705' WHERE id_distrito = 440 AND ubigeo IS NULL; -- AREQUIPA / ISLAY / MEJIA
UPDATE public.distrito SET ubigeo = '040706' WHERE id_distrito = 441 AND ubigeo IS NULL; -- AREQUIPA / ISLAY / PUNTA DE BOMBON
UPDATE public.distrito SET ubigeo = '040801' WHERE id_distrito = 442 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / COTAHUASI
UPDATE public.distrito SET ubigeo = '040802' WHERE id_distrito = 443 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / ALCA
UPDATE public.distrito SET ubigeo = '040803' WHERE id_distrito = 444 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / CHARCANA
UPDATE public.distrito SET ubigeo = '040804' WHERE id_distrito = 445 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / HUAYNACOTAS
UPDATE public.distrito SET ubigeo = '040805' WHERE id_distrito = 446 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / PAMPAMARCA
UPDATE public.distrito SET ubigeo = '040806' WHERE id_distrito = 447 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / PUYCA
UPDATE public.distrito SET ubigeo = '040807' WHERE id_distrito = 448 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / QUECHUALLA
UPDATE public.distrito SET ubigeo = '040808' WHERE id_distrito = 449 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / SAYLA
UPDATE public.distrito SET ubigeo = '040809' WHERE id_distrito = 450 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / TAURIA
UPDATE public.distrito SET ubigeo = '040810' WHERE id_distrito = 451 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / TOMEPAMPA
UPDATE public.distrito SET ubigeo = '040811' WHERE id_distrito = 452 AND ubigeo IS NULL; -- AREQUIPA / LA UNION / TORO
UPDATE public.distrito SET ubigeo = '050101' WHERE id_distrito = 453 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / AYACUCHO
UPDATE public.distrito SET ubigeo = '050102' WHERE id_distrito = 454 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / ACOCRO
UPDATE public.distrito SET ubigeo = '050103' WHERE id_distrito = 455 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / ACOS VINCHOS
UPDATE public.distrito SET ubigeo = '050104' WHERE id_distrito = 456 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / CARMEN ALTO
UPDATE public.distrito SET ubigeo = '050105' WHERE id_distrito = 457 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / CHIARA
UPDATE public.distrito SET ubigeo = '050106' WHERE id_distrito = 458 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / OCROS
UPDATE public.distrito SET ubigeo = '050107' WHERE id_distrito = 459 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / PACAYCASA
UPDATE public.distrito SET ubigeo = '050108' WHERE id_distrito = 460 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / QUINUA
UPDATE public.distrito SET ubigeo = '050109' WHERE id_distrito = 461 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / SAN JOSE DE TICLLAS
UPDATE public.distrito SET ubigeo = '050110' WHERE id_distrito = 462 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / SAN JUAN BAUTISTA
UPDATE public.distrito SET ubigeo = '050111' WHERE id_distrito = 463 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / SANTIAGO DE PISCHA
UPDATE public.distrito SET ubigeo = '050112' WHERE id_distrito = 464 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / SOCOS
UPDATE public.distrito SET ubigeo = '050113' WHERE id_distrito = 465 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / TAMBILLO
UPDATE public.distrito SET ubigeo = '050114' WHERE id_distrito = 466 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / VINCHOS
UPDATE public.distrito SET ubigeo = '050115' WHERE id_distrito = 467 AND ubigeo IS NULL; -- AYACUCHO / HUAMANGA / JESUS NAZARENO
UPDATE public.distrito SET ubigeo = '050201' WHERE id_distrito = 469 AND ubigeo IS NULL; -- AYACUCHO / CANGALLO / CANGALLO
UPDATE public.distrito SET ubigeo = '050202' WHERE id_distrito = 470 AND ubigeo IS NULL; -- AYACUCHO / CANGALLO / CHUSCHI
UPDATE public.distrito SET ubigeo = '050203' WHERE id_distrito = 471 AND ubigeo IS NULL; -- AYACUCHO / CANGALLO / LOS MOROCHUCOS
UPDATE public.distrito SET ubigeo = '050204' WHERE id_distrito = 472 AND ubigeo IS NULL; -- AYACUCHO / CANGALLO / MARIA PARADO DE BELLIDO
UPDATE public.distrito SET ubigeo = '050205' WHERE id_distrito = 473 AND ubigeo IS NULL; -- AYACUCHO / CANGALLO / PARAS
UPDATE public.distrito SET ubigeo = '050206' WHERE id_distrito = 474 AND ubigeo IS NULL; -- AYACUCHO / CANGALLO / TOTOS
UPDATE public.distrito SET ubigeo = '050301' WHERE id_distrito = 475 AND ubigeo IS NULL; -- AYACUCHO / HUANCA SANCOS / SANCOS
UPDATE public.distrito SET ubigeo = '050302' WHERE id_distrito = 476 AND ubigeo IS NULL; -- AYACUCHO / HUANCA SANCOS / CARAPO
UPDATE public.distrito SET ubigeo = '050303' WHERE id_distrito = 477 AND ubigeo IS NULL; -- AYACUCHO / HUANCA SANCOS / SACSAMARCA
UPDATE public.distrito SET ubigeo = '050304' WHERE id_distrito = 478 AND ubigeo IS NULL; -- AYACUCHO / HUANCA SANCOS / SANTIAGO DE LUCANAMARCA
UPDATE public.distrito SET ubigeo = '050401' WHERE id_distrito = 479 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / HUANTA
UPDATE public.distrito SET ubigeo = '050402' WHERE id_distrito = 480 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / AYAHUANCO
UPDATE public.distrito SET ubigeo = '050403' WHERE id_distrito = 481 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / HUAMANGUILLA
UPDATE public.distrito SET ubigeo = '050404' WHERE id_distrito = 482 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / IGUAIN
UPDATE public.distrito SET ubigeo = '050405' WHERE id_distrito = 483 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / LURICOCHA
UPDATE public.distrito SET ubigeo = '050406' WHERE id_distrito = 484 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / SANTILLANA
UPDATE public.distrito SET ubigeo = '050407' WHERE id_distrito = 485 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / SIVIA
UPDATE public.distrito SET ubigeo = '050408' WHERE id_distrito = 486 AND ubigeo IS NULL; -- AYACUCHO / HUANTA / LLOCHEGUA
UPDATE public.distrito SET ubigeo = '050501' WHERE id_distrito = 492 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / SAN MIGUEL
UPDATE public.distrito SET ubigeo = '050502' WHERE id_distrito = 493 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / ANCO
UPDATE public.distrito SET ubigeo = '050503' WHERE id_distrito = 494 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / AYNA
UPDATE public.distrito SET ubigeo = '050504' WHERE id_distrito = 495 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / CHILCAS
UPDATE public.distrito SET ubigeo = '050505' WHERE id_distrito = 496 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / CHUNGUI
UPDATE public.distrito SET ubigeo = '050506' WHERE id_distrito = 497 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / LUIS CARRANZA
UPDATE public.distrito SET ubigeo = '050507' WHERE id_distrito = 498 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / SANTA ROSA
UPDATE public.distrito SET ubigeo = '050508' WHERE id_distrito = 499 AND ubigeo IS NULL; -- AYACUCHO / LA MAR / TAMBO
UPDATE public.distrito SET ubigeo = '050601' WHERE id_distrito = 507 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / PUQUIO
UPDATE public.distrito SET ubigeo = '050602' WHERE id_distrito = 508 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / AUCARA
UPDATE public.distrito SET ubigeo = '050603' WHERE id_distrito = 509 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / CABANA
UPDATE public.distrito SET ubigeo = '050604' WHERE id_distrito = 510 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / CARMEN SALCEDO
UPDATE public.distrito SET ubigeo = '050606' WHERE id_distrito = 512 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / CHIPAO
UPDATE public.distrito SET ubigeo = '050607' WHERE id_distrito = 513 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / HUAC-HUAS
UPDATE public.distrito SET ubigeo = '050608' WHERE id_distrito = 514 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / LARAMATE
UPDATE public.distrito SET ubigeo = '050609' WHERE id_distrito = 515 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / LEONCIO PRADO
UPDATE public.distrito SET ubigeo = '050610' WHERE id_distrito = 516 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / LLAUTA
UPDATE public.distrito SET ubigeo = '050611' WHERE id_distrito = 517 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / LUCANAS
UPDATE public.distrito SET ubigeo = '050613' WHERE id_distrito = 519 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / OTOCA
UPDATE public.distrito SET ubigeo = '050614' WHERE id_distrito = 520 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SAISA
UPDATE public.distrito SET ubigeo = '050615' WHERE id_distrito = 521 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SAN CRISTOBAL
UPDATE public.distrito SET ubigeo = '050616' WHERE id_distrito = 522 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SAN JUAN
UPDATE public.distrito SET ubigeo = '050617' WHERE id_distrito = 523 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SAN PEDRO
UPDATE public.distrito SET ubigeo = '050618' WHERE id_distrito = 524 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SAN PEDRO DE PALCO
UPDATE public.distrito SET ubigeo = '050619' WHERE id_distrito = 525 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SANCOS
UPDATE public.distrito SET ubigeo = '050620' WHERE id_distrito = 526 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SANTA ANA DE HUAYCAHUACHO
UPDATE public.distrito SET ubigeo = '050621' WHERE id_distrito = 527 AND ubigeo IS NULL; -- AYACUCHO / LUCANAS / SANTA LUCIA
UPDATE public.distrito SET ubigeo = '050701' WHERE id_distrito = 528 AND ubigeo IS NULL; -- AYACUCHO / PARINACOCHAS / CORACORA
UPDATE public.distrito SET ubigeo = '050702' WHERE id_distrito = 529 AND ubigeo IS NULL; -- AYACUCHO / PARINACOCHAS / CHUMPI
UPDATE public.distrito SET ubigeo = '050704' WHERE id_distrito = 531 AND ubigeo IS NULL; -- AYACUCHO / PARINACOCHAS / PACAPAUSA
UPDATE public.distrito SET ubigeo = '050705' WHERE id_distrito = 532 AND ubigeo IS NULL; -- AYACUCHO / PARINACOCHAS / PULLO
UPDATE public.distrito SET ubigeo = '050706' WHERE id_distrito = 533 AND ubigeo IS NULL; -- AYACUCHO / PARINACOCHAS / PUYUSCA
UPDATE public.distrito SET ubigeo = '050708' WHERE id_distrito = 535 AND ubigeo IS NULL; -- AYACUCHO / PARINACOCHAS / UPAHUACHO
UPDATE public.distrito SET ubigeo = '050801' WHERE id_distrito = 536 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / PAUSA
UPDATE public.distrito SET ubigeo = '050802' WHERE id_distrito = 537 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / COLTA
UPDATE public.distrito SET ubigeo = '050803' WHERE id_distrito = 538 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / CORCULLA
UPDATE public.distrito SET ubigeo = '050804' WHERE id_distrito = 539 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / LAMPA
UPDATE public.distrito SET ubigeo = '050805' WHERE id_distrito = 540 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / MARCABAMBA
UPDATE public.distrito SET ubigeo = '050806' WHERE id_distrito = 541 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / OYOLO
UPDATE public.distrito SET ubigeo = '050807' WHERE id_distrito = 542 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / PARARCA
UPDATE public.distrito SET ubigeo = '050808' WHERE id_distrito = 543 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / SAN JAVIER DE ALPABAMBA
UPDATE public.distrito SET ubigeo = '050809' WHERE id_distrito = 544 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / SAN JOSE DE USHUA
UPDATE public.distrito SET ubigeo = '050810' WHERE id_distrito = 545 AND ubigeo IS NULL; -- AYACUCHO / PAUCAR DEL SARA SARA / SARA SARA
UPDATE public.distrito SET ubigeo = '050901' WHERE id_distrito = 546 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / QUEROBAMBA
UPDATE public.distrito SET ubigeo = '050902' WHERE id_distrito = 547 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / BELEN
UPDATE public.distrito SET ubigeo = '050903' WHERE id_distrito = 548 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / CHALCOS
UPDATE public.distrito SET ubigeo = '050904' WHERE id_distrito = 549 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / CHILCAYOC
UPDATE public.distrito SET ubigeo = '050906' WHERE id_distrito = 551 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / MORCOLLA
UPDATE public.distrito SET ubigeo = '050907' WHERE id_distrito = 552 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / PAICO
UPDATE public.distrito SET ubigeo = '050908' WHERE id_distrito = 553 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / SAN PEDRO DE LARCAY
UPDATE public.distrito SET ubigeo = '050909' WHERE id_distrito = 554 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / SAN SALVADOR DE QUIJE
UPDATE public.distrito SET ubigeo = '050910' WHERE id_distrito = 555 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / SANTIAGO DE PAUCARAY
UPDATE public.distrito SET ubigeo = '050911' WHERE id_distrito = 556 AND ubigeo IS NULL; -- AYACUCHO / SUCRE / SORAS
UPDATE public.distrito SET ubigeo = '051001' WHERE id_distrito = 557 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / HUANCAPI
UPDATE public.distrito SET ubigeo = '051002' WHERE id_distrito = 558 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / ALCAMENCA
UPDATE public.distrito SET ubigeo = '051003' WHERE id_distrito = 559 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / APONGO
UPDATE public.distrito SET ubigeo = '051004' WHERE id_distrito = 560 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / ASQUIPATA
UPDATE public.distrito SET ubigeo = '051005' WHERE id_distrito = 561 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / CANARIA
UPDATE public.distrito SET ubigeo = '051006' WHERE id_distrito = 562 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / CAYARA
UPDATE public.distrito SET ubigeo = '051007' WHERE id_distrito = 563 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / COLCA
UPDATE public.distrito SET ubigeo = '051008' WHERE id_distrito = 564 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / HUAMANQUIQUIA
UPDATE public.distrito SET ubigeo = '051009' WHERE id_distrito = 565 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / HUANCARAYLLA
UPDATE public.distrito SET ubigeo = '051011' WHERE id_distrito = 567 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / SARHUA
UPDATE public.distrito SET ubigeo = '051012' WHERE id_distrito = 568 AND ubigeo IS NULL; -- AYACUCHO / VICTOR FAJARDO / VILCANCHOS
UPDATE public.distrito SET ubigeo = '051101' WHERE id_distrito = 569 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / VILCAS HUAMAN
UPDATE public.distrito SET ubigeo = '051102' WHERE id_distrito = 570 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / ACCOMARCA
UPDATE public.distrito SET ubigeo = '051103' WHERE id_distrito = 571 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / CARHUANCA
UPDATE public.distrito SET ubigeo = '051104' WHERE id_distrito = 572 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / CONCEPCION
UPDATE public.distrito SET ubigeo = '051105' WHERE id_distrito = 573 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / HUAMBALPA
UPDATE public.distrito SET ubigeo = '051107' WHERE id_distrito = 575 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / SAURAMA
UPDATE public.distrito SET ubigeo = '051108' WHERE id_distrito = 576 AND ubigeo IS NULL; -- AYACUCHO / VILCAS HUAMAN / VISCHONGO
UPDATE public.distrito SET ubigeo = '060101' WHERE id_distrito = 577 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / CAJAMARCA
UPDATE public.distrito SET ubigeo = '060102' WHERE id_distrito = 578 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / ASUNCION
UPDATE public.distrito SET ubigeo = '060103' WHERE id_distrito = 579 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / CHETILLA
UPDATE public.distrito SET ubigeo = '060104' WHERE id_distrito = 580 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / COSPAN
UPDATE public.distrito SET ubigeo = '060106' WHERE id_distrito = 582 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / JESUS
UPDATE public.distrito SET ubigeo = '060107' WHERE id_distrito = 583 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / LLACANORA
UPDATE public.distrito SET ubigeo = '060109' WHERE id_distrito = 585 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / MAGDALENA
UPDATE public.distrito SET ubigeo = '060110' WHERE id_distrito = 586 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / MATARA
UPDATE public.distrito SET ubigeo = '060111' WHERE id_distrito = 587 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / NAMORA
UPDATE public.distrito SET ubigeo = '060112' WHERE id_distrito = 588 AND ubigeo IS NULL; -- CAJAMARCA / CAJAMARCA / SAN JUAN
UPDATE public.distrito SET ubigeo = '060201' WHERE id_distrito = 589 AND ubigeo IS NULL; -- CAJAMARCA / CAJABAMBA / CAJABAMBA
UPDATE public.distrito SET ubigeo = '060202' WHERE id_distrito = 590 AND ubigeo IS NULL; -- CAJAMARCA / CAJABAMBA / CACHACHI
UPDATE public.distrito SET ubigeo = '060203' WHERE id_distrito = 591 AND ubigeo IS NULL; -- CAJAMARCA / CAJABAMBA / CONDEBAMBA
UPDATE public.distrito SET ubigeo = '060204' WHERE id_distrito = 592 AND ubigeo IS NULL; -- CAJAMARCA / CAJABAMBA / SITACOCHA
UPDATE public.distrito SET ubigeo = '060301' WHERE id_distrito = 593 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / CELENDIN
UPDATE public.distrito SET ubigeo = '060302' WHERE id_distrito = 594 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / CHUMUCH
UPDATE public.distrito SET ubigeo = '060303' WHERE id_distrito = 595 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / CORTEGANA
UPDATE public.distrito SET ubigeo = '060304' WHERE id_distrito = 596 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / HUASMIN
UPDATE public.distrito SET ubigeo = '060305' WHERE id_distrito = 597 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / JORGE CHAVEZ
UPDATE public.distrito SET ubigeo = '060306' WHERE id_distrito = 598 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / JOSE GALVEZ
UPDATE public.distrito SET ubigeo = '060307' WHERE id_distrito = 599 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / MIGUEL IGLESIAS
UPDATE public.distrito SET ubigeo = '060308' WHERE id_distrito = 600 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / OXAMARCA
UPDATE public.distrito SET ubigeo = '060309' WHERE id_distrito = 601 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / SOROCHUCO
UPDATE public.distrito SET ubigeo = '060310' WHERE id_distrito = 602 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / SUCRE
UPDATE public.distrito SET ubigeo = '060311' WHERE id_distrito = 603 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / UTCO
UPDATE public.distrito SET ubigeo = '060312' WHERE id_distrito = 604 AND ubigeo IS NULL; -- CAJAMARCA / CELENDIN / LA LIBERTAD DE PALLAN
UPDATE public.distrito SET ubigeo = '060401' WHERE id_distrito = 605 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CHOTA
UPDATE public.distrito SET ubigeo = '060402' WHERE id_distrito = 606 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / ANGUIA
UPDATE public.distrito SET ubigeo = '060403' WHERE id_distrito = 607 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CHADIN
UPDATE public.distrito SET ubigeo = '060404' WHERE id_distrito = 608 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CHIGUIRIP
UPDATE public.distrito SET ubigeo = '060405' WHERE id_distrito = 609 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CHIMBAN
UPDATE public.distrito SET ubigeo = '060406' WHERE id_distrito = 610 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CHOROPAMPA
UPDATE public.distrito SET ubigeo = '060407' WHERE id_distrito = 611 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / COCHABAMBA
UPDATE public.distrito SET ubigeo = '060408' WHERE id_distrito = 612 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CONCHAN
UPDATE public.distrito SET ubigeo = '060409' WHERE id_distrito = 613 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / HUAMBOS
UPDATE public.distrito SET ubigeo = '060410' WHERE id_distrito = 614 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / LAJAS
UPDATE public.distrito SET ubigeo = '060411' WHERE id_distrito = 615 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / LLAMA
UPDATE public.distrito SET ubigeo = '060412' WHERE id_distrito = 616 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / MIRACOSTA
UPDATE public.distrito SET ubigeo = '060413' WHERE id_distrito = 617 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / PACCHA
UPDATE public.distrito SET ubigeo = '060414' WHERE id_distrito = 618 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / PION
UPDATE public.distrito SET ubigeo = '060415' WHERE id_distrito = 619 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / QUEROCOTO
UPDATE public.distrito SET ubigeo = '060416' WHERE id_distrito = 620 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / SAN JUAN DE LICUPIS
UPDATE public.distrito SET ubigeo = '060417' WHERE id_distrito = 621 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / TACABAMBA
UPDATE public.distrito SET ubigeo = '060418' WHERE id_distrito = 622 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / TOCMOCHE
UPDATE public.distrito SET ubigeo = '060419' WHERE id_distrito = 623 AND ubigeo IS NULL; -- CAJAMARCA / CHOTA / CHALAMARCA
UPDATE public.distrito SET ubigeo = '060501' WHERE id_distrito = 624 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / CONTUMAZA
UPDATE public.distrito SET ubigeo = '060502' WHERE id_distrito = 625 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / CHILETE
UPDATE public.distrito SET ubigeo = '060503' WHERE id_distrito = 626 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / CUPISNIQUE
UPDATE public.distrito SET ubigeo = '060504' WHERE id_distrito = 627 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / GUZMANGO
UPDATE public.distrito SET ubigeo = '060505' WHERE id_distrito = 628 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / SAN BENITO
UPDATE public.distrito SET ubigeo = '060506' WHERE id_distrito = 629 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / SANTA CRUZ DE TOLED
UPDATE public.distrito SET ubigeo = '060507' WHERE id_distrito = 630 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / TANTARICA
UPDATE public.distrito SET ubigeo = '060508' WHERE id_distrito = 631 AND ubigeo IS NULL; -- CAJAMARCA / CONTUMAZA / YONAN
UPDATE public.distrito SET ubigeo = '060601' WHERE id_distrito = 632 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / CUTERVO
UPDATE public.distrito SET ubigeo = '060602' WHERE id_distrito = 633 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / CALLAYUC
UPDATE public.distrito SET ubigeo = '060603' WHERE id_distrito = 634 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / CHOROS
UPDATE public.distrito SET ubigeo = '060604' WHERE id_distrito = 635 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / CUJILLO
UPDATE public.distrito SET ubigeo = '060605' WHERE id_distrito = 636 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / LA RAMADA
UPDATE public.distrito SET ubigeo = '060606' WHERE id_distrito = 637 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / PIMPINGOS
UPDATE public.distrito SET ubigeo = '060607' WHERE id_distrito = 638 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / QUEROCOTILLO
UPDATE public.distrito SET ubigeo = '060608' WHERE id_distrito = 639 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SAN ANDRES DE CUTERVO
UPDATE public.distrito SET ubigeo = '060609' WHERE id_distrito = 640 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SAN JUAN DE CUTERVO
UPDATE public.distrito SET ubigeo = '060610' WHERE id_distrito = 641 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SAN LUIS DE LUCMA
UPDATE public.distrito SET ubigeo = '060611' WHERE id_distrito = 642 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SANTA CRUZ
UPDATE public.distrito SET ubigeo = '060612' WHERE id_distrito = 643 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SANTO DOMINGO DE LA CAPILLA
UPDATE public.distrito SET ubigeo = '060613' WHERE id_distrito = 644 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SANTO TOMAS
UPDATE public.distrito SET ubigeo = '060614' WHERE id_distrito = 645 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / SOCOTA
UPDATE public.distrito SET ubigeo = '060615' WHERE id_distrito = 646 AND ubigeo IS NULL; -- CAJAMARCA / CUTERVO / TORIBIO CASANOVA
UPDATE public.distrito SET ubigeo = '060701' WHERE id_distrito = 647 AND ubigeo IS NULL; -- CAJAMARCA / HUALGAYOC / BAMBAMARCA
UPDATE public.distrito SET ubigeo = '060702' WHERE id_distrito = 648 AND ubigeo IS NULL; -- CAJAMARCA / HUALGAYOC / CHUGUR
UPDATE public.distrito SET ubigeo = '060703' WHERE id_distrito = 649 AND ubigeo IS NULL; -- CAJAMARCA / HUALGAYOC / HUALGAYOC
UPDATE public.distrito SET ubigeo = '060801' WHERE id_distrito = 650 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / JAEN
UPDATE public.distrito SET ubigeo = '060802' WHERE id_distrito = 651 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / BELLAVISTA
UPDATE public.distrito SET ubigeo = '060803' WHERE id_distrito = 652 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / CHONTALI
UPDATE public.distrito SET ubigeo = '060804' WHERE id_distrito = 653 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / COLASAY
UPDATE public.distrito SET ubigeo = '060805' WHERE id_distrito = 654 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / HUABAL
UPDATE public.distrito SET ubigeo = '060806' WHERE id_distrito = 655 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / LAS PIRIAS
UPDATE public.distrito SET ubigeo = '060807' WHERE id_distrito = 656 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / POMAHUACA
UPDATE public.distrito SET ubigeo = '060808' WHERE id_distrito = 657 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / PUCARA
UPDATE public.distrito SET ubigeo = '060809' WHERE id_distrito = 658 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / SALLIQUE
UPDATE public.distrito SET ubigeo = '060810' WHERE id_distrito = 659 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / SAN FELIPE
UPDATE public.distrito SET ubigeo = '060811' WHERE id_distrito = 660 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / SAN JOSE DEL ALTO
UPDATE public.distrito SET ubigeo = '060812' WHERE id_distrito = 661 AND ubigeo IS NULL; -- CAJAMARCA / JAEN / SANTA ROSA
UPDATE public.distrito SET ubigeo = '060901' WHERE id_distrito = 662 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / SAN IGNACIO
UPDATE public.distrito SET ubigeo = '060902' WHERE id_distrito = 663 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / CHIRINOS
UPDATE public.distrito SET ubigeo = '060903' WHERE id_distrito = 664 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / HUARANGO
UPDATE public.distrito SET ubigeo = '060904' WHERE id_distrito = 665 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / LA COIPA
UPDATE public.distrito SET ubigeo = '060905' WHERE id_distrito = 666 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / NAMBALLE
UPDATE public.distrito SET ubigeo = '060906' WHERE id_distrito = 667 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / SAN JOSE DE LOURDES
UPDATE public.distrito SET ubigeo = '060907' WHERE id_distrito = 668 AND ubigeo IS NULL; -- CAJAMARCA / SAN IGNACIO / TABACONAS
UPDATE public.distrito SET ubigeo = '061001' WHERE id_distrito = 669 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / PEDRO GALVEZ
UPDATE public.distrito SET ubigeo = '061002' WHERE id_distrito = 670 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / CHANCAY
UPDATE public.distrito SET ubigeo = '061003' WHERE id_distrito = 671 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / EDUARDO VILLANUEVA
UPDATE public.distrito SET ubigeo = '061004' WHERE id_distrito = 672 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / GREGORIO PITA
UPDATE public.distrito SET ubigeo = '061005' WHERE id_distrito = 673 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / ICHOCAN
UPDATE public.distrito SET ubigeo = '061006' WHERE id_distrito = 674 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / JOSE MANUEL QUIROZ
UPDATE public.distrito SET ubigeo = '061007' WHERE id_distrito = 675 AND ubigeo IS NULL; -- CAJAMARCA / SAN MARCOS / JOSE SABOGAL
UPDATE public.distrito SET ubigeo = '061101' WHERE id_distrito = 676 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / SAN MIGUEL
UPDATE public.distrito SET ubigeo = '061102' WHERE id_distrito = 677 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / BOLIVAR
UPDATE public.distrito SET ubigeo = '061103' WHERE id_distrito = 678 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / CALQUIS
UPDATE public.distrito SET ubigeo = '061104' WHERE id_distrito = 679 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / CATILLUC
UPDATE public.distrito SET ubigeo = '061105' WHERE id_distrito = 680 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / EL PRADO
UPDATE public.distrito SET ubigeo = '061106' WHERE id_distrito = 681 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / LA FLORIDA
UPDATE public.distrito SET ubigeo = '061107' WHERE id_distrito = 682 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / LLAPA
UPDATE public.distrito SET ubigeo = '061108' WHERE id_distrito = 683 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / NANCHOC
UPDATE public.distrito SET ubigeo = '061109' WHERE id_distrito = 684 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / NIEPOS
UPDATE public.distrito SET ubigeo = '061110' WHERE id_distrito = 685 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / SAN GREGORIO
UPDATE public.distrito SET ubigeo = '061111' WHERE id_distrito = 686 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / SAN SILVESTRE DE COCHAN
UPDATE public.distrito SET ubigeo = '061112' WHERE id_distrito = 687 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / TONGOD
UPDATE public.distrito SET ubigeo = '061113' WHERE id_distrito = 688 AND ubigeo IS NULL; -- CAJAMARCA / SAN MIGUEL / UNION AGUA BLANCA
UPDATE public.distrito SET ubigeo = '061201' WHERE id_distrito = 689 AND ubigeo IS NULL; -- CAJAMARCA / SAN PABLO / SAN PABLO
UPDATE public.distrito SET ubigeo = '061202' WHERE id_distrito = 690 AND ubigeo IS NULL; -- CAJAMARCA / SAN PABLO / SAN BERNARDINO
UPDATE public.distrito SET ubigeo = '061203' WHERE id_distrito = 691 AND ubigeo IS NULL; -- CAJAMARCA / SAN PABLO / SAN LUIS
UPDATE public.distrito SET ubigeo = '061204' WHERE id_distrito = 692 AND ubigeo IS NULL; -- CAJAMARCA / SAN PABLO / TUMBADEN
UPDATE public.distrito SET ubigeo = '061301' WHERE id_distrito = 693 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / SANTA CRUZ
UPDATE public.distrito SET ubigeo = '061302' WHERE id_distrito = 694 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / ANDABAMBA
UPDATE public.distrito SET ubigeo = '061303' WHERE id_distrito = 695 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / CATACHE
UPDATE public.distrito SET ubigeo = '061305' WHERE id_distrito = 697 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / LA ESPERANZA
UPDATE public.distrito SET ubigeo = '061307' WHERE id_distrito = 699 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / PULAN
UPDATE public.distrito SET ubigeo = '061308' WHERE id_distrito = 700 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / SAUCEPAMPA
UPDATE public.distrito SET ubigeo = '061309' WHERE id_distrito = 701 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / SEXI
UPDATE public.distrito SET ubigeo = '061310' WHERE id_distrito = 702 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / UTICYACU
UPDATE public.distrito SET ubigeo = '061311' WHERE id_distrito = 703 AND ubigeo IS NULL; -- CAJAMARCA / SANTA CRUZ / YAUYUCAN
UPDATE public.distrito SET ubigeo = '080101' WHERE id_distrito = 711 AND ubigeo IS NULL; -- CUSCO / CUSCO / CUSCO
UPDATE public.distrito SET ubigeo = '080102' WHERE id_distrito = 712 AND ubigeo IS NULL; -- CUSCO / CUSCO / CCORCA
UPDATE public.distrito SET ubigeo = '080103' WHERE id_distrito = 713 AND ubigeo IS NULL; -- CUSCO / CUSCO / POROY
UPDATE public.distrito SET ubigeo = '080104' WHERE id_distrito = 714 AND ubigeo IS NULL; -- CUSCO / CUSCO / SAN JERONIMO
UPDATE public.distrito SET ubigeo = '080105' WHERE id_distrito = 715 AND ubigeo IS NULL; -- CUSCO / CUSCO / SAN SEBASTIAN
UPDATE public.distrito SET ubigeo = '080106' WHERE id_distrito = 716 AND ubigeo IS NULL; -- CUSCO / CUSCO / SANTIAGO
UPDATE public.distrito SET ubigeo = '080107' WHERE id_distrito = 717 AND ubigeo IS NULL; -- CUSCO / CUSCO / SAYLLA
UPDATE public.distrito SET ubigeo = '080108' WHERE id_distrito = 718 AND ubigeo IS NULL; -- CUSCO / CUSCO / WANCHAQ
UPDATE public.distrito SET ubigeo = '080201' WHERE id_distrito = 719 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / ACOMAYO
UPDATE public.distrito SET ubigeo = '080202' WHERE id_distrito = 720 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / ACOPIA
UPDATE public.distrito SET ubigeo = '080203' WHERE id_distrito = 721 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / ACOS
UPDATE public.distrito SET ubigeo = '080204' WHERE id_distrito = 722 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / MOSOC LLACTA
UPDATE public.distrito SET ubigeo = '080205' WHERE id_distrito = 723 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / POMACANCHI
UPDATE public.distrito SET ubigeo = '080206' WHERE id_distrito = 724 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / RONDOCAN
UPDATE public.distrito SET ubigeo = '080207' WHERE id_distrito = 725 AND ubigeo IS NULL; -- CUSCO / ACOMAYO / SANGARARA
UPDATE public.distrito SET ubigeo = '080301' WHERE id_distrito = 726 AND ubigeo IS NULL; -- CUSCO / ANTA / ANTA
UPDATE public.distrito SET ubigeo = '080302' WHERE id_distrito = 727 AND ubigeo IS NULL; -- CUSCO / ANTA / ANCAHUASI
UPDATE public.distrito SET ubigeo = '080303' WHERE id_distrito = 728 AND ubigeo IS NULL; -- CUSCO / ANTA / CACHIMAYO
UPDATE public.distrito SET ubigeo = '080304' WHERE id_distrito = 729 AND ubigeo IS NULL; -- CUSCO / ANTA / CHINCHAYPUJIO
UPDATE public.distrito SET ubigeo = '080305' WHERE id_distrito = 730 AND ubigeo IS NULL; -- CUSCO / ANTA / HUAROCONDO
UPDATE public.distrito SET ubigeo = '080306' WHERE id_distrito = 731 AND ubigeo IS NULL; -- CUSCO / ANTA / LIMATAMBO
UPDATE public.distrito SET ubigeo = '080307' WHERE id_distrito = 732 AND ubigeo IS NULL; -- CUSCO / ANTA / MOLLEPATA
UPDATE public.distrito SET ubigeo = '080308' WHERE id_distrito = 733 AND ubigeo IS NULL; -- CUSCO / ANTA / PUCYURA
UPDATE public.distrito SET ubigeo = '080309' WHERE id_distrito = 734 AND ubigeo IS NULL; -- CUSCO / ANTA / ZURITE
UPDATE public.distrito SET ubigeo = '080401' WHERE id_distrito = 735 AND ubigeo IS NULL; -- CUSCO / CALCA / CALCA
UPDATE public.distrito SET ubigeo = '080402' WHERE id_distrito = 736 AND ubigeo IS NULL; -- CUSCO / CALCA / COYA
UPDATE public.distrito SET ubigeo = '080403' WHERE id_distrito = 737 AND ubigeo IS NULL; -- CUSCO / CALCA / LAMAY
UPDATE public.distrito SET ubigeo = '080404' WHERE id_distrito = 738 AND ubigeo IS NULL; -- CUSCO / CALCA / LARES
UPDATE public.distrito SET ubigeo = '080405' WHERE id_distrito = 739 AND ubigeo IS NULL; -- CUSCO / CALCA / PISAC
UPDATE public.distrito SET ubigeo = '080406' WHERE id_distrito = 740 AND ubigeo IS NULL; -- CUSCO / CALCA / SAN SALVADOR
UPDATE public.distrito SET ubigeo = '080407' WHERE id_distrito = 741 AND ubigeo IS NULL; -- CUSCO / CALCA / TARAY
UPDATE public.distrito SET ubigeo = '080408' WHERE id_distrito = 742 AND ubigeo IS NULL; -- CUSCO / CALCA / YANATILE
UPDATE public.distrito SET ubigeo = '080501' WHERE id_distrito = 743 AND ubigeo IS NULL; -- CUSCO / CANAS / YANAOCA
UPDATE public.distrito SET ubigeo = '080502' WHERE id_distrito = 744 AND ubigeo IS NULL; -- CUSCO / CANAS / CHECCA
UPDATE public.distrito SET ubigeo = '080503' WHERE id_distrito = 745 AND ubigeo IS NULL; -- CUSCO / CANAS / KUNTURKANKI
UPDATE public.distrito SET ubigeo = '080504' WHERE id_distrito = 746 AND ubigeo IS NULL; -- CUSCO / CANAS / LANGUI
UPDATE public.distrito SET ubigeo = '080505' WHERE id_distrito = 747 AND ubigeo IS NULL; -- CUSCO / CANAS / LAYO
UPDATE public.distrito SET ubigeo = '080506' WHERE id_distrito = 748 AND ubigeo IS NULL; -- CUSCO / CANAS / PAMPAMARCA
UPDATE public.distrito SET ubigeo = '080507' WHERE id_distrito = 749 AND ubigeo IS NULL; -- CUSCO / CANAS / QUEHUE
UPDATE public.distrito SET ubigeo = '080508' WHERE id_distrito = 750 AND ubigeo IS NULL; -- CUSCO / CANAS / TUPAC AMARU
UPDATE public.distrito SET ubigeo = '080601' WHERE id_distrito = 751 AND ubigeo IS NULL; -- CUSCO / CANCHIS / SICUANI
UPDATE public.distrito SET ubigeo = '080602' WHERE id_distrito = 752 AND ubigeo IS NULL; -- CUSCO / CANCHIS / CHECACUPE
UPDATE public.distrito SET ubigeo = '080603' WHERE id_distrito = 753 AND ubigeo IS NULL; -- CUSCO / CANCHIS / COMBAPATA
UPDATE public.distrito SET ubigeo = '080604' WHERE id_distrito = 754 AND ubigeo IS NULL; -- CUSCO / CANCHIS / MARANGANI
UPDATE public.distrito SET ubigeo = '080605' WHERE id_distrito = 755 AND ubigeo IS NULL; -- CUSCO / CANCHIS / PITUMARCA
UPDATE public.distrito SET ubigeo = '080606' WHERE id_distrito = 756 AND ubigeo IS NULL; -- CUSCO / CANCHIS / SAN PABLO
UPDATE public.distrito SET ubigeo = '080607' WHERE id_distrito = 757 AND ubigeo IS NULL; -- CUSCO / CANCHIS / SAN PEDRO
UPDATE public.distrito SET ubigeo = '080608' WHERE id_distrito = 758 AND ubigeo IS NULL; -- CUSCO / CANCHIS / TINTA
UPDATE public.distrito SET ubigeo = '080701' WHERE id_distrito = 759 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / SANTO TOMAS
UPDATE public.distrito SET ubigeo = '080702' WHERE id_distrito = 760 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / CAPACMARCA
UPDATE public.distrito SET ubigeo = '080703' WHERE id_distrito = 761 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / CHAMACA
UPDATE public.distrito SET ubigeo = '080704' WHERE id_distrito = 762 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / COLQUEMARCA
UPDATE public.distrito SET ubigeo = '080705' WHERE id_distrito = 763 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / LIVITACA
UPDATE public.distrito SET ubigeo = '080706' WHERE id_distrito = 764 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / LLUSCO
UPDATE public.distrito SET ubigeo = '080708' WHERE id_distrito = 766 AND ubigeo IS NULL; -- CUSCO / CHUMBIVILCAS / VELILLE
UPDATE public.distrito SET ubigeo = '080801' WHERE id_distrito = 767 AND ubigeo IS NULL; -- CUSCO / ESPINAR / ESPINAR
UPDATE public.distrito SET ubigeo = '080802' WHERE id_distrito = 768 AND ubigeo IS NULL; -- CUSCO / ESPINAR / CONDOROMA
UPDATE public.distrito SET ubigeo = '080803' WHERE id_distrito = 769 AND ubigeo IS NULL; -- CUSCO / ESPINAR / COPORAQUE
UPDATE public.distrito SET ubigeo = '080804' WHERE id_distrito = 770 AND ubigeo IS NULL; -- CUSCO / ESPINAR / OCORURO
UPDATE public.distrito SET ubigeo = '080805' WHERE id_distrito = 771 AND ubigeo IS NULL; -- CUSCO / ESPINAR / PALLPATA
UPDATE public.distrito SET ubigeo = '080806' WHERE id_distrito = 772 AND ubigeo IS NULL; -- CUSCO / ESPINAR / PICHIGUA
UPDATE public.distrito SET ubigeo = '080808' WHERE id_distrito = 774 AND ubigeo IS NULL; -- CUSCO / ESPINAR / ALTO PICHIGUA
UPDATE public.distrito SET ubigeo = '080901' WHERE id_distrito = 775 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / SANTA ANA
UPDATE public.distrito SET ubigeo = '080902' WHERE id_distrito = 776 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / ECHARATE
UPDATE public.distrito SET ubigeo = '080904' WHERE id_distrito = 778 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / MARANURA
UPDATE public.distrito SET ubigeo = '080906' WHERE id_distrito = 780 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / QUELLOUNO
UPDATE public.distrito SET ubigeo = '080907' WHERE id_distrito = 781 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / KIMBIRI
UPDATE public.distrito SET ubigeo = '080908' WHERE id_distrito = 782 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / SANTA TERESA
UPDATE public.distrito SET ubigeo = '080909' WHERE id_distrito = 783 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / VILCABAMBA
UPDATE public.distrito SET ubigeo = '080910' WHERE id_distrito = 784 AND ubigeo IS NULL; -- CUSCO / LA CONVENCION / PICHARI
UPDATE public.distrito SET ubigeo = '081001' WHERE id_distrito = 793 AND ubigeo IS NULL; -- CUSCO / PARURO / PARURO
UPDATE public.distrito SET ubigeo = '081002' WHERE id_distrito = 794 AND ubigeo IS NULL; -- CUSCO / PARURO / ACCHA
UPDATE public.distrito SET ubigeo = '081003' WHERE id_distrito = 795 AND ubigeo IS NULL; -- CUSCO / PARURO / CCAPI
UPDATE public.distrito SET ubigeo = '081004' WHERE id_distrito = 796 AND ubigeo IS NULL; -- CUSCO / PARURO / COLCHA
UPDATE public.distrito SET ubigeo = '081005' WHERE id_distrito = 797 AND ubigeo IS NULL; -- CUSCO / PARURO / HUANOQUITE
UPDATE public.distrito SET ubigeo = '081006' WHERE id_distrito = 798 AND ubigeo IS NULL; -- CUSCO / PARURO / OMACHA
UPDATE public.distrito SET ubigeo = '081007' WHERE id_distrito = 799 AND ubigeo IS NULL; -- CUSCO / PARURO / PACCARITAMBO
UPDATE public.distrito SET ubigeo = '081008' WHERE id_distrito = 800 AND ubigeo IS NULL; -- CUSCO / PARURO / PILLPINTO
UPDATE public.distrito SET ubigeo = '081009' WHERE id_distrito = 801 AND ubigeo IS NULL; -- CUSCO / PARURO / YAURISQUE
UPDATE public.distrito SET ubigeo = '081101' WHERE id_distrito = 802 AND ubigeo IS NULL; -- CUSCO / PAUCARTAMBO / PAUCARTAMBO
UPDATE public.distrito SET ubigeo = '081102' WHERE id_distrito = 803 AND ubigeo IS NULL; -- CUSCO / PAUCARTAMBO / CAICAY
UPDATE public.distrito SET ubigeo = '081103' WHERE id_distrito = 804 AND ubigeo IS NULL; -- CUSCO / PAUCARTAMBO / CHALLABAMBA
UPDATE public.distrito SET ubigeo = '081104' WHERE id_distrito = 805 AND ubigeo IS NULL; -- CUSCO / PAUCARTAMBO / COLQUEPATA
UPDATE public.distrito SET ubigeo = '081105' WHERE id_distrito = 806 AND ubigeo IS NULL; -- CUSCO / PAUCARTAMBO / HUANCARANI
UPDATE public.distrito SET ubigeo = '081201' WHERE id_distrito = 808 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / URCOS
UPDATE public.distrito SET ubigeo = '081202' WHERE id_distrito = 809 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / ANDAHUAYLILLAS
UPDATE public.distrito SET ubigeo = '081203' WHERE id_distrito = 810 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / CAMANTI
UPDATE public.distrito SET ubigeo = '081204' WHERE id_distrito = 811 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / CCARHUAYO
UPDATE public.distrito SET ubigeo = '081205' WHERE id_distrito = 812 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / CCATCA
UPDATE public.distrito SET ubigeo = '081206' WHERE id_distrito = 813 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / CUSIPATA
UPDATE public.distrito SET ubigeo = '081207' WHERE id_distrito = 814 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / HUARO
UPDATE public.distrito SET ubigeo = '081208' WHERE id_distrito = 815 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / LUCRE
UPDATE public.distrito SET ubigeo = '081209' WHERE id_distrito = 816 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / MARCAPATA
UPDATE public.distrito SET ubigeo = '081210' WHERE id_distrito = 817 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / OCONGATE
UPDATE public.distrito SET ubigeo = '081211' WHERE id_distrito = 818 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / OROPESA
UPDATE public.distrito SET ubigeo = '081212' WHERE id_distrito = 819 AND ubigeo IS NULL; -- CUSCO / QUISPICANCHI / QUIQUIJANA
UPDATE public.distrito SET ubigeo = '081301' WHERE id_distrito = 820 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / URUBAMBA
UPDATE public.distrito SET ubigeo = '081302' WHERE id_distrito = 821 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / CHINCHERO
UPDATE public.distrito SET ubigeo = '081303' WHERE id_distrito = 822 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / HUAYLLABAMBA
UPDATE public.distrito SET ubigeo = '081304' WHERE id_distrito = 823 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / MACHUPICCHU
UPDATE public.distrito SET ubigeo = '081305' WHERE id_distrito = 824 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / MARAS
UPDATE public.distrito SET ubigeo = '081306' WHERE id_distrito = 825 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / OLLANTAYTAMBO
UPDATE public.distrito SET ubigeo = '081307' WHERE id_distrito = 826 AND ubigeo IS NULL; -- CUSCO / URUBAMBA / YUCAY
UPDATE public.distrito SET ubigeo = '090101' WHERE id_distrito = 827 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / HUANCAVELICA
UPDATE public.distrito SET ubigeo = '090102' WHERE id_distrito = 828 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / ACOBAMBILLA
UPDATE public.distrito SET ubigeo = '090103' WHERE id_distrito = 829 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / ACORIA
UPDATE public.distrito SET ubigeo = '090104' WHERE id_distrito = 830 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / CONAYCA
UPDATE public.distrito SET ubigeo = '090105' WHERE id_distrito = 831 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / CUENCA
UPDATE public.distrito SET ubigeo = '090106' WHERE id_distrito = 832 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / HUACHOCOLPA
UPDATE public.distrito SET ubigeo = '090107' WHERE id_distrito = 833 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / HUAYLLAHUARA
UPDATE public.distrito SET ubigeo = '090108' WHERE id_distrito = 834 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / IZCUCHACA
UPDATE public.distrito SET ubigeo = '090109' WHERE id_distrito = 835 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / LARIA
UPDATE public.distrito SET ubigeo = '090110' WHERE id_distrito = 836 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / MANTA
UPDATE public.distrito SET ubigeo = '090111' WHERE id_distrito = 837 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / MARISCAL CACERES
UPDATE public.distrito SET ubigeo = '090112' WHERE id_distrito = 838 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / MOYA
UPDATE public.distrito SET ubigeo = '090113' WHERE id_distrito = 839 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / NUEVO OCCORO
UPDATE public.distrito SET ubigeo = '090114' WHERE id_distrito = 840 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / PALCA
UPDATE public.distrito SET ubigeo = '090115' WHERE id_distrito = 841 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / PILCHACA
UPDATE public.distrito SET ubigeo = '090116' WHERE id_distrito = 842 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / VILCA
UPDATE public.distrito SET ubigeo = '090117' WHERE id_distrito = 843 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / YAULI
UPDATE public.distrito SET ubigeo = '090118' WHERE id_distrito = 844 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / ASCENSION
UPDATE public.distrito SET ubigeo = '090119' WHERE id_distrito = 845 AND ubigeo IS NULL; -- HUANCAVELICA / HUANCAVELICA / HUANDO
UPDATE public.distrito SET ubigeo = '090201' WHERE id_distrito = 846 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / ACOBAMBA
UPDATE public.distrito SET ubigeo = '090202' WHERE id_distrito = 847 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / ANDABAMBA
UPDATE public.distrito SET ubigeo = '090203' WHERE id_distrito = 848 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / ANTA
UPDATE public.distrito SET ubigeo = '090204' WHERE id_distrito = 849 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / CAJA
UPDATE public.distrito SET ubigeo = '090205' WHERE id_distrito = 850 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / MARCAS
UPDATE public.distrito SET ubigeo = '090206' WHERE id_distrito = 851 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / PAUCARA
UPDATE public.distrito SET ubigeo = '090207' WHERE id_distrito = 852 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / POMACOCHA
UPDATE public.distrito SET ubigeo = '090208' WHERE id_distrito = 853 AND ubigeo IS NULL; -- HUANCAVELICA / ACOBAMBA / ROSARIO
UPDATE public.distrito SET ubigeo = '090301' WHERE id_distrito = 854 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / LIRCAY
UPDATE public.distrito SET ubigeo = '090302' WHERE id_distrito = 855 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / ANCHONGA
UPDATE public.distrito SET ubigeo = '090303' WHERE id_distrito = 856 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / CALLANMARCA
UPDATE public.distrito SET ubigeo = '090304' WHERE id_distrito = 857 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / CCOCHACCASA
UPDATE public.distrito SET ubigeo = '090305' WHERE id_distrito = 858 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / CHINCHO
UPDATE public.distrito SET ubigeo = '090306' WHERE id_distrito = 859 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / CONGALLA
UPDATE public.distrito SET ubigeo = '090307' WHERE id_distrito = 860 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / HUANCA-HUANCA
UPDATE public.distrito SET ubigeo = '090308' WHERE id_distrito = 861 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / HUAYLLAY GRANDE
UPDATE public.distrito SET ubigeo = '090309' WHERE id_distrito = 862 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / JULCAMARCA
UPDATE public.distrito SET ubigeo = '090310' WHERE id_distrito = 863 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / SAN ANTONIO DE ANTAPARCO
UPDATE public.distrito SET ubigeo = '090311' WHERE id_distrito = 864 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / SANTO TOMAS DE PATA
UPDATE public.distrito SET ubigeo = '090312' WHERE id_distrito = 865 AND ubigeo IS NULL; -- HUANCAVELICA / ANGARAES / SECCLLA
UPDATE public.distrito SET ubigeo = '090401' WHERE id_distrito = 866 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / CASTROVIRREYNA
UPDATE public.distrito SET ubigeo = '090402' WHERE id_distrito = 867 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / ARMA
UPDATE public.distrito SET ubigeo = '090403' WHERE id_distrito = 868 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / AURAHUA
UPDATE public.distrito SET ubigeo = '090404' WHERE id_distrito = 869 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / CAPILLAS
UPDATE public.distrito SET ubigeo = '090405' WHERE id_distrito = 870 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / CHUPAMARCA
UPDATE public.distrito SET ubigeo = '090406' WHERE id_distrito = 871 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / COCAS
UPDATE public.distrito SET ubigeo = '090407' WHERE id_distrito = 872 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / HUACHOS
UPDATE public.distrito SET ubigeo = '090408' WHERE id_distrito = 873 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / HUAMATAMBO
UPDATE public.distrito SET ubigeo = '090409' WHERE id_distrito = 874 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / MOLLEPAMPA
UPDATE public.distrito SET ubigeo = '090410' WHERE id_distrito = 875 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / SAN JUAN
UPDATE public.distrito SET ubigeo = '090411' WHERE id_distrito = 876 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / SANTA ANA
UPDATE public.distrito SET ubigeo = '090412' WHERE id_distrito = 877 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / TANTARA
UPDATE public.distrito SET ubigeo = '090413' WHERE id_distrito = 878 AND ubigeo IS NULL; -- HUANCAVELICA / CASTROVIRREYNA / TICRAPO
UPDATE public.distrito SET ubigeo = '090501' WHERE id_distrito = 879 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / CHURCAMPA
UPDATE public.distrito SET ubigeo = '090502' WHERE id_distrito = 880 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / ANCO
UPDATE public.distrito SET ubigeo = '090503' WHERE id_distrito = 881 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / CHINCHIHUASI
UPDATE public.distrito SET ubigeo = '090504' WHERE id_distrito = 882 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / EL CARMEN
UPDATE public.distrito SET ubigeo = '090505' WHERE id_distrito = 883 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / LA MERCED
UPDATE public.distrito SET ubigeo = '090506' WHERE id_distrito = 884 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / LOCROJA
UPDATE public.distrito SET ubigeo = '090507' WHERE id_distrito = 885 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / PAUCARBAMBA
UPDATE public.distrito SET ubigeo = '090508' WHERE id_distrito = 886 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / SAN MIGUEL DE MAYOCC
UPDATE public.distrito SET ubigeo = '090509' WHERE id_distrito = 887 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / SAN PEDRO DE CORIS
UPDATE public.distrito SET ubigeo = '090510' WHERE id_distrito = 888 AND ubigeo IS NULL; -- HUANCAVELICA / CHURCAMPA / PACHAMARCA
UPDATE public.distrito SET ubigeo = '090601' WHERE id_distrito = 890 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / HUAYTARA
UPDATE public.distrito SET ubigeo = '090602' WHERE id_distrito = 891 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / AYAVI
UPDATE public.distrito SET ubigeo = '090603' WHERE id_distrito = 892 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / CORDOVA
UPDATE public.distrito SET ubigeo = '090604' WHERE id_distrito = 893 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / HUAYACUNDO ARMA
UPDATE public.distrito SET ubigeo = '090605' WHERE id_distrito = 894 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / LARAMARCA
UPDATE public.distrito SET ubigeo = '090606' WHERE id_distrito = 895 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / OCOYO
UPDATE public.distrito SET ubigeo = '090607' WHERE id_distrito = 896 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / PILPICHACA
UPDATE public.distrito SET ubigeo = '090608' WHERE id_distrito = 897 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / QUERCO
UPDATE public.distrito SET ubigeo = '090609' WHERE id_distrito = 898 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / QUITO-ARMA
UPDATE public.distrito SET ubigeo = '090610' WHERE id_distrito = 899 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / SAN ANTONIO DE CUSICANCHA
UPDATE public.distrito SET ubigeo = '090611' WHERE id_distrito = 900 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / SAN FRANCISCO DE SANGAYAICO
UPDATE public.distrito SET ubigeo = '090612' WHERE id_distrito = 901 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / SAN ISIDRO
UPDATE public.distrito SET ubigeo = '090613' WHERE id_distrito = 902 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / SANTIAGO DE CHOCORVOS
UPDATE public.distrito SET ubigeo = '090614' WHERE id_distrito = 903 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / SANTIAGO DE QUIRAHUARA
UPDATE public.distrito SET ubigeo = '090615' WHERE id_distrito = 904 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / SANTO DOMINGO DE CAPILLAS
UPDATE public.distrito SET ubigeo = '090616' WHERE id_distrito = 905 AND ubigeo IS NULL; -- HUANCAVELICA / HUAYTARA / TAMBO
UPDATE public.distrito SET ubigeo = '090701' WHERE id_distrito = 906 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / PAMPAS
UPDATE public.distrito SET ubigeo = '090702' WHERE id_distrito = 907 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / ACOSTAMBO
UPDATE public.distrito SET ubigeo = '090703' WHERE id_distrito = 908 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / ACRAQUIA
UPDATE public.distrito SET ubigeo = '090704' WHERE id_distrito = 909 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / AHUAYCHA
UPDATE public.distrito SET ubigeo = '090705' WHERE id_distrito = 910 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / COLCABAMBA
UPDATE public.distrito SET ubigeo = '090706' WHERE id_distrito = 911 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / DANIEL HERNANDEZ
UPDATE public.distrito SET ubigeo = '090707' WHERE id_distrito = 912 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / HUACHOCOLPA
UPDATE public.distrito SET ubigeo = '090709' WHERE id_distrito = 913 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / HUARIBAMBA
UPDATE public.distrito SET ubigeo = '090711' WHERE id_distrito = 915 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / PAZOS
UPDATE public.distrito SET ubigeo = '090713' WHERE id_distrito = 916 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / QUISHUAR
UPDATE public.distrito SET ubigeo = '090714' WHERE id_distrito = 917 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / SALCABAMBA
UPDATE public.distrito SET ubigeo = '090715' WHERE id_distrito = 918 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / SALCAHUASI
UPDATE public.distrito SET ubigeo = '090716' WHERE id_distrito = 919 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / SAN MARCOS DE ROCCHAC
UPDATE public.distrito SET ubigeo = '090717' WHERE id_distrito = 920 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / SURCUBAMBA
UPDATE public.distrito SET ubigeo = '090718' WHERE id_distrito = 921 AND ubigeo IS NULL; -- HUANCAVELICA / TAYACAJA / TINTAY PUNCU
UPDATE public.distrito SET ubigeo = '100101' WHERE id_distrito = 929 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / HUANUCO
UPDATE public.distrito SET ubigeo = '100102' WHERE id_distrito = 930 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / AMARILIS
UPDATE public.distrito SET ubigeo = '100103' WHERE id_distrito = 931 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / CHINCHAO
UPDATE public.distrito SET ubigeo = '100104' WHERE id_distrito = 932 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / CHURUBAMBA
UPDATE public.distrito SET ubigeo = '100105' WHERE id_distrito = 933 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / MARGOS
UPDATE public.distrito SET ubigeo = '100106' WHERE id_distrito = 934 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / QUISQUI
UPDATE public.distrito SET ubigeo = '100107' WHERE id_distrito = 935 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / SAN FRANCISCO DE CAYRAN
UPDATE public.distrito SET ubigeo = '100108' WHERE id_distrito = 936 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / SAN PEDRO DE CHAULAN
UPDATE public.distrito SET ubigeo = '100109' WHERE id_distrito = 937 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / SANTA MARIA DEL VALLE
UPDATE public.distrito SET ubigeo = '100110' WHERE id_distrito = 938 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / YARUMAYO
UPDATE public.distrito SET ubigeo = '100111' WHERE id_distrito = 939 AND ubigeo IS NULL; -- HUANUCO / HUANUCO / PILLCO MARCA
UPDATE public.distrito SET ubigeo = '100201' WHERE id_distrito = 942 AND ubigeo IS NULL; -- HUANUCO / AMBO / AMBO
UPDATE public.distrito SET ubigeo = '100202' WHERE id_distrito = 943 AND ubigeo IS NULL; -- HUANUCO / AMBO / CAYNA
UPDATE public.distrito SET ubigeo = '100203' WHERE id_distrito = 944 AND ubigeo IS NULL; -- HUANUCO / AMBO / COLPAS
UPDATE public.distrito SET ubigeo = '100204' WHERE id_distrito = 945 AND ubigeo IS NULL; -- HUANUCO / AMBO / CONCHAMARCA
UPDATE public.distrito SET ubigeo = '100205' WHERE id_distrito = 946 AND ubigeo IS NULL; -- HUANUCO / AMBO / HUACAR
UPDATE public.distrito SET ubigeo = '100206' WHERE id_distrito = 947 AND ubigeo IS NULL; -- HUANUCO / AMBO / SAN FRANCISCO
UPDATE public.distrito SET ubigeo = '100207' WHERE id_distrito = 948 AND ubigeo IS NULL; -- HUANUCO / AMBO / SAN RAFAEL
UPDATE public.distrito SET ubigeo = '100208' WHERE id_distrito = 949 AND ubigeo IS NULL; -- HUANUCO / AMBO / TOMAY KICHWA
UPDATE public.distrito SET ubigeo = '100301' WHERE id_distrito = 950 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / LA UNION
UPDATE public.distrito SET ubigeo = '100307' WHERE id_distrito = 951 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / CHUQUIS
UPDATE public.distrito SET ubigeo = '100311' WHERE id_distrito = 952 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / MARIAS
UPDATE public.distrito SET ubigeo = '100313' WHERE id_distrito = 953 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / PACHAS
UPDATE public.distrito SET ubigeo = '100316' WHERE id_distrito = 954 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / QUIVILLA
UPDATE public.distrito SET ubigeo = '100317' WHERE id_distrito = 955 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / RIPAN
UPDATE public.distrito SET ubigeo = '100321' WHERE id_distrito = 956 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / SHUNQUI
UPDATE public.distrito SET ubigeo = '100322' WHERE id_distrito = 957 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / SILLAPATA
UPDATE public.distrito SET ubigeo = '100323' WHERE id_distrito = 958 AND ubigeo IS NULL; -- HUANUCO / DOS DE MAYO / YANAS
UPDATE public.distrito SET ubigeo = '100401' WHERE id_distrito = 959 AND ubigeo IS NULL; -- HUANUCO / HUACAYBAMBA / HUACAYBAMBA
UPDATE public.distrito SET ubigeo = '100402' WHERE id_distrito = 960 AND ubigeo IS NULL; -- HUANUCO / HUACAYBAMBA / CANCHABAMBA
UPDATE public.distrito SET ubigeo = '100403' WHERE id_distrito = 961 AND ubigeo IS NULL; -- HUANUCO / HUACAYBAMBA / COCHABAMBA
UPDATE public.distrito SET ubigeo = '100404' WHERE id_distrito = 962 AND ubigeo IS NULL; -- HUANUCO / HUACAYBAMBA / PINRA
UPDATE public.distrito SET ubigeo = '100501' WHERE id_distrito = 963 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / LLATA
UPDATE public.distrito SET ubigeo = '100502' WHERE id_distrito = 964 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / ARANCAY
UPDATE public.distrito SET ubigeo = '100503' WHERE id_distrito = 965 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / CHAVIN DE PARIARCA
UPDATE public.distrito SET ubigeo = '100504' WHERE id_distrito = 966 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / JACAS GRANDE
UPDATE public.distrito SET ubigeo = '100505' WHERE id_distrito = 967 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / JIRCAN
UPDATE public.distrito SET ubigeo = '100506' WHERE id_distrito = 968 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / MIRAFLORES
UPDATE public.distrito SET ubigeo = '100507' WHERE id_distrito = 969 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / MONZON
UPDATE public.distrito SET ubigeo = '100508' WHERE id_distrito = 970 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / PUNCHAO
UPDATE public.distrito SET ubigeo = '100510' WHERE id_distrito = 972 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / SINGA
UPDATE public.distrito SET ubigeo = '100511' WHERE id_distrito = 973 AND ubigeo IS NULL; -- HUANUCO / HUAMALIES / TANTAMAYO
UPDATE public.distrito SET ubigeo = '100601' WHERE id_distrito = 974 AND ubigeo IS NULL; -- HUANUCO / LEONCIO PRADO / RUPA-RUPA
UPDATE public.distrito SET ubigeo = '100602' WHERE id_distrito = 975 AND ubigeo IS NULL; -- HUANUCO / LEONCIO PRADO / DANIEL ALOMIA ROBLES
UPDATE public.distrito SET ubigeo = '100603' WHERE id_distrito = 976 AND ubigeo IS NULL; -- HUANUCO / LEONCIO PRADO / HERMILIO VALDIZAN
UPDATE public.distrito SET ubigeo = '100604' WHERE id_distrito = 977 AND ubigeo IS NULL; -- HUANUCO / LEONCIO PRADO / JOSE CRESPO Y CASTILLO
UPDATE public.distrito SET ubigeo = '100606' WHERE id_distrito = 979 AND ubigeo IS NULL; -- HUANUCO / LEONCIO PRADO / MARIANO DAMASO BERAUN
UPDATE public.distrito SET ubigeo = '100801' WHERE id_distrito = 989 AND ubigeo IS NULL; -- HUANUCO / PACHITEA / PANAO
UPDATE public.distrito SET ubigeo = '100802' WHERE id_distrito = 990 AND ubigeo IS NULL; -- HUANUCO / PACHITEA / CHAGLLA
UPDATE public.distrito SET ubigeo = '100803' WHERE id_distrito = 991 AND ubigeo IS NULL; -- HUANUCO / PACHITEA / MOLINO
UPDATE public.distrito SET ubigeo = '100804' WHERE id_distrito = 992 AND ubigeo IS NULL; -- HUANUCO / PACHITEA / UMARI
UPDATE public.distrito SET ubigeo = '100901' WHERE id_distrito = 993 AND ubigeo IS NULL; -- HUANUCO / PUERTO INCA / PUERTO INCA
UPDATE public.distrito SET ubigeo = '100902' WHERE id_distrito = 994 AND ubigeo IS NULL; -- HUANUCO / PUERTO INCA / CODO DEL POZUZO
UPDATE public.distrito SET ubigeo = '100903' WHERE id_distrito = 995 AND ubigeo IS NULL; -- HUANUCO / PUERTO INCA / HONORIA
UPDATE public.distrito SET ubigeo = '100904' WHERE id_distrito = 996 AND ubigeo IS NULL; -- HUANUCO / PUERTO INCA / TOURNAVISTA
UPDATE public.distrito SET ubigeo = '100905' WHERE id_distrito = 997 AND ubigeo IS NULL; -- HUANUCO / PUERTO INCA / YUYAPICHIS
UPDATE public.distrito SET ubigeo = '101001' WHERE id_distrito = 998 AND ubigeo IS NULL; -- HUANUCO / LAURICOCHA / JESUS
UPDATE public.distrito SET ubigeo = '101003' WHERE id_distrito = 1000 AND ubigeo IS NULL; -- HUANUCO / LAURICOCHA / JIVIA
UPDATE public.distrito SET ubigeo = '101004' WHERE id_distrito = 1001 AND ubigeo IS NULL; -- HUANUCO / LAURICOCHA / QUEROPALCA
UPDATE public.distrito SET ubigeo = '101005' WHERE id_distrito = 1002 AND ubigeo IS NULL; -- HUANUCO / LAURICOCHA / RONDOS
UPDATE public.distrito SET ubigeo = '101006' WHERE id_distrito = 1003 AND ubigeo IS NULL; -- HUANUCO / LAURICOCHA / SAN FRANCISCO DE ASIS
UPDATE public.distrito SET ubigeo = '101007' WHERE id_distrito = 1004 AND ubigeo IS NULL; -- HUANUCO / LAURICOCHA / SAN MIGUEL DE CAURI
UPDATE public.distrito SET ubigeo = '101101' WHERE id_distrito = 1005 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / CHAVINILLO
UPDATE public.distrito SET ubigeo = '101102' WHERE id_distrito = 1006 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / CAHUAC
UPDATE public.distrito SET ubigeo = '101103' WHERE id_distrito = 1007 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / CHACABAMBA
UPDATE public.distrito SET ubigeo = '101104' WHERE id_distrito = 1008 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / APARICIO POMARES
UPDATE public.distrito SET ubigeo = '101105' WHERE id_distrito = 1009 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / JACAS CHICO
UPDATE public.distrito SET ubigeo = '101106' WHERE id_distrito = 1010 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / OBAS
UPDATE public.distrito SET ubigeo = '101107' WHERE id_distrito = 1011 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / PAMPAMARCA
UPDATE public.distrito SET ubigeo = '101108' WHERE id_distrito = 1012 AND ubigeo IS NULL; -- HUANUCO / YAROWILCA / CHORAS
UPDATE public.distrito SET ubigeo = '110103' WHERE id_distrito = 1013 AND ubigeo IS NULL; -- ICA / ICA / LOS AQUIJES
UPDATE public.distrito SET ubigeo = '110104' WHERE id_distrito = 1014 AND ubigeo IS NULL; -- ICA / ICA / OCUCAJE
UPDATE public.distrito SET ubigeo = '110105' WHERE id_distrito = 1015 AND ubigeo IS NULL; -- ICA / ICA / PACHACUTEC
UPDATE public.distrito SET ubigeo = '110107' WHERE id_distrito = 1016 AND ubigeo IS NULL; -- ICA / ICA / PUEBLO NUEVO
UPDATE public.distrito SET ubigeo = '110108' WHERE id_distrito = 1017 AND ubigeo IS NULL; -- ICA / ICA / SALAS
UPDATE public.distrito SET ubigeo = '110109' WHERE id_distrito = 1018 AND ubigeo IS NULL; -- ICA / ICA / SAN JOSE DE LOS MOLINOS
UPDATE public.distrito SET ubigeo = '110111' WHERE id_distrito = 1019 AND ubigeo IS NULL; -- ICA / ICA / SANTIAGO
UPDATE public.distrito SET ubigeo = '110113' WHERE id_distrito = 1020 AND ubigeo IS NULL; -- ICA / ICA / TATE
UPDATE public.distrito SET ubigeo = '110202' WHERE id_distrito = 1022 AND ubigeo IS NULL; -- ICA / CHINCHA / ALTO LARAN
UPDATE public.distrito SET ubigeo = '110203' WHERE id_distrito = 1023 AND ubigeo IS NULL; -- ICA / CHINCHA / CHAVIN
UPDATE public.distrito SET ubigeo = '110204' WHERE id_distrito = 1024 AND ubigeo IS NULL; -- ICA / CHINCHA / CHINCHA BAJA
UPDATE public.distrito SET ubigeo = '110205' WHERE id_distrito = 1025 AND ubigeo IS NULL; -- ICA / CHINCHA / EL CARMEN
UPDATE public.distrito SET ubigeo = '110206' WHERE id_distrito = 1026 AND ubigeo IS NULL; -- ICA / CHINCHA / GROCIO PRADO
UPDATE public.distrito SET ubigeo = '110207' WHERE id_distrito = 1027 AND ubigeo IS NULL; -- ICA / CHINCHA / PUEBLO NUEVO
UPDATE public.distrito SET ubigeo = '110208' WHERE id_distrito = 1028 AND ubigeo IS NULL; -- ICA / CHINCHA / SAN JUAN DE YANAC
UPDATE public.distrito SET ubigeo = '110209' WHERE id_distrito = 1029 AND ubigeo IS NULL; -- ICA / CHINCHA / SAN PEDRO DE HUACARPANA
UPDATE public.distrito SET ubigeo = '110210' WHERE id_distrito = 1030 AND ubigeo IS NULL; -- ICA / CHINCHA / SUNAMPE
UPDATE public.distrito SET ubigeo = '110211' WHERE id_distrito = 1031 AND ubigeo IS NULL; -- ICA / CHINCHA / TAMBO DE MORA
UPDATE public.distrito SET ubigeo = '110401' WHERE id_distrito = 1037 AND ubigeo IS NULL; -- ICA / PALPA / PALPA
UPDATE public.distrito SET ubigeo = '110402' WHERE id_distrito = 1038 AND ubigeo IS NULL; -- ICA / PALPA / LLIPATA
UPDATE public.distrito SET ubigeo = '110403' WHERE id_distrito = 1039 AND ubigeo IS NULL; -- ICA / PALPA / RIO GRANDE
UPDATE public.distrito SET ubigeo = '110404' WHERE id_distrito = 1040 AND ubigeo IS NULL; -- ICA / PALPA / SANTA CRUZ
UPDATE public.distrito SET ubigeo = '110405' WHERE id_distrito = 1041 AND ubigeo IS NULL; -- ICA / PALPA / TIBILLO
UPDATE public.distrito SET ubigeo = '110502' WHERE id_distrito = 1042 AND ubigeo IS NULL; -- ICA / PISCO / HUANCANO
UPDATE public.distrito SET ubigeo = '110503' WHERE id_distrito = 1043 AND ubigeo IS NULL; -- ICA / PISCO / HUMAY
UPDATE public.distrito SET ubigeo = '110504' WHERE id_distrito = 1044 AND ubigeo IS NULL; -- ICA / PISCO / INDEPENDENCIA
UPDATE public.distrito SET ubigeo = '110505' WHERE id_distrito = 1045 AND ubigeo IS NULL; -- ICA / PISCO / PARACAS
UPDATE public.distrito SET ubigeo = '110506' WHERE id_distrito = 1046 AND ubigeo IS NULL; -- ICA / PISCO / SAN ANDRES
UPDATE public.distrito SET ubigeo = '110507' WHERE id_distrito = 1047 AND ubigeo IS NULL; -- ICA / PISCO / SAN CLEMENTE
UPDATE public.distrito SET ubigeo = '110508' WHERE id_distrito = 1048 AND ubigeo IS NULL; -- ICA / PISCO / TUPAC AMARU INCA
UPDATE public.distrito SET ubigeo = '120101' WHERE id_distrito = 1049 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / HUANCAYO
UPDATE public.distrito SET ubigeo = '120104' WHERE id_distrito = 1050 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CARHUACALLANGA
UPDATE public.distrito SET ubigeo = '120105' WHERE id_distrito = 1051 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CHACAPAMPA
UPDATE public.distrito SET ubigeo = '120106' WHERE id_distrito = 1052 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CHICCHE
UPDATE public.distrito SET ubigeo = '120107' WHERE id_distrito = 1053 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CHILCA
UPDATE public.distrito SET ubigeo = '120108' WHERE id_distrito = 1054 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CHONGOS ALTO
UPDATE public.distrito SET ubigeo = '120111' WHERE id_distrito = 1055 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CHUPURO
UPDATE public.distrito SET ubigeo = '120112' WHERE id_distrito = 1056 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / COLCA
UPDATE public.distrito SET ubigeo = '120113' WHERE id_distrito = 1057 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / CULLHUAS
UPDATE public.distrito SET ubigeo = '120114' WHERE id_distrito = 1058 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / EL TAMBO
UPDATE public.distrito SET ubigeo = '120116' WHERE id_distrito = 1059 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / HUACRAPUQUIO
UPDATE public.distrito SET ubigeo = '120117' WHERE id_distrito = 1060 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / HUALHUAS
UPDATE public.distrito SET ubigeo = '120119' WHERE id_distrito = 1061 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / HUANCAN
UPDATE public.distrito SET ubigeo = '120120' WHERE id_distrito = 1062 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / HUASICANCHA
UPDATE public.distrito SET ubigeo = '120121' WHERE id_distrito = 1063 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / HUAYUCACHI
UPDATE public.distrito SET ubigeo = '120122' WHERE id_distrito = 1064 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / INGENIO
UPDATE public.distrito SET ubigeo = '120125' WHERE id_distrito = 1066 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / PILCOMAYO
UPDATE public.distrito SET ubigeo = '120126' WHERE id_distrito = 1067 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / PUCARA
UPDATE public.distrito SET ubigeo = '120127' WHERE id_distrito = 1068 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / QUICHUAY
UPDATE public.distrito SET ubigeo = '120128' WHERE id_distrito = 1069 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / QUILCAS
UPDATE public.distrito SET ubigeo = '120129' WHERE id_distrito = 1070 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / SAN AGUSTIN
UPDATE public.distrito SET ubigeo = '120130' WHERE id_distrito = 1071 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / SAN JERONIMO DE TUNAN
UPDATE public.distrito SET ubigeo = '120133' WHERE id_distrito = 1073 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / SAPALLANGA
UPDATE public.distrito SET ubigeo = '120134' WHERE id_distrito = 1074 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / SICAYA
UPDATE public.distrito SET ubigeo = '120135' WHERE id_distrito = 1075 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / SANTO DOMINGO DE ACOBAMBA
UPDATE public.distrito SET ubigeo = '120136' WHERE id_distrito = 1076 AND ubigeo IS NULL; -- JUNIN / HUANCAYO / VIQUES
UPDATE public.distrito SET ubigeo = '120201' WHERE id_distrito = 1077 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / CONCEPCION
UPDATE public.distrito SET ubigeo = '120202' WHERE id_distrito = 1078 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / ACO
UPDATE public.distrito SET ubigeo = '120203' WHERE id_distrito = 1079 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / ANDAMARCA
UPDATE public.distrito SET ubigeo = '120204' WHERE id_distrito = 1080 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / CHAMBARA
UPDATE public.distrito SET ubigeo = '120205' WHERE id_distrito = 1081 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / COCHAS
UPDATE public.distrito SET ubigeo = '120206' WHERE id_distrito = 1082 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / COMAS
UPDATE public.distrito SET ubigeo = '120207' WHERE id_distrito = 1083 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / HEROINAS TOLEDO
UPDATE public.distrito SET ubigeo = '120208' WHERE id_distrito = 1084 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / MANZANARES
UPDATE public.distrito SET ubigeo = '120209' WHERE id_distrito = 1085 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / MARISCAL CASTILLA
UPDATE public.distrito SET ubigeo = '120210' WHERE id_distrito = 1086 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / MATAHUASI
UPDATE public.distrito SET ubigeo = '120211' WHERE id_distrito = 1087 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / MITO
UPDATE public.distrito SET ubigeo = '120212' WHERE id_distrito = 1088 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / NUEVE DE JULIO
UPDATE public.distrito SET ubigeo = '120213' WHERE id_distrito = 1089 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / ORCOTUNA
UPDATE public.distrito SET ubigeo = '120214' WHERE id_distrito = 1090 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / SAN JOSE DE QUERO
UPDATE public.distrito SET ubigeo = '120215' WHERE id_distrito = 1091 AND ubigeo IS NULL; -- JUNIN / CONCEPCION / SANTA ROSA DE OCOPA
UPDATE public.distrito SET ubigeo = '120301' WHERE id_distrito = 1092 AND ubigeo IS NULL; -- JUNIN / CHANCHAMAYO / CHANCHAMAYO
UPDATE public.distrito SET ubigeo = '120302' WHERE id_distrito = 1093 AND ubigeo IS NULL; -- JUNIN / CHANCHAMAYO / PERENE
UPDATE public.distrito SET ubigeo = '120303' WHERE id_distrito = 1094 AND ubigeo IS NULL; -- JUNIN / CHANCHAMAYO / PICHANAQUI
UPDATE public.distrito SET ubigeo = '120304' WHERE id_distrito = 1095 AND ubigeo IS NULL; -- JUNIN / CHANCHAMAYO / SAN LUIS DE SHUARO
UPDATE public.distrito SET ubigeo = '120305' WHERE id_distrito = 1096 AND ubigeo IS NULL; -- JUNIN / CHANCHAMAYO / SAN RAMON
UPDATE public.distrito SET ubigeo = '120306' WHERE id_distrito = 1097 AND ubigeo IS NULL; -- JUNIN / CHANCHAMAYO / VITOC
UPDATE public.distrito SET ubigeo = '120401' WHERE id_distrito = 1098 AND ubigeo IS NULL; -- JUNIN / JAUJA / JAUJA
UPDATE public.distrito SET ubigeo = '120402' WHERE id_distrito = 1099 AND ubigeo IS NULL; -- JUNIN / JAUJA / ACOLLA
UPDATE public.distrito SET ubigeo = '120403' WHERE id_distrito = 1100 AND ubigeo IS NULL; -- JUNIN / JAUJA / APATA
UPDATE public.distrito SET ubigeo = '120404' WHERE id_distrito = 1101 AND ubigeo IS NULL; -- JUNIN / JAUJA / ATAURA
UPDATE public.distrito SET ubigeo = '120405' WHERE id_distrito = 1102 AND ubigeo IS NULL; -- JUNIN / JAUJA / CANCHAYLLO
UPDATE public.distrito SET ubigeo = '120406' WHERE id_distrito = 1103 AND ubigeo IS NULL; -- JUNIN / JAUJA / CURICACA
UPDATE public.distrito SET ubigeo = '120407' WHERE id_distrito = 1104 AND ubigeo IS NULL; -- JUNIN / JAUJA / EL MANTARO
UPDATE public.distrito SET ubigeo = '120408' WHERE id_distrito = 1105 AND ubigeo IS NULL; -- JUNIN / JAUJA / HUAMALI
UPDATE public.distrito SET ubigeo = '120409' WHERE id_distrito = 1106 AND ubigeo IS NULL; -- JUNIN / JAUJA / HUARIPAMPA
UPDATE public.distrito SET ubigeo = '120410' WHERE id_distrito = 1107 AND ubigeo IS NULL; -- JUNIN / JAUJA / HUERTAS
UPDATE public.distrito SET ubigeo = '120411' WHERE id_distrito = 1108 AND ubigeo IS NULL; -- JUNIN / JAUJA / JANJAILLO
UPDATE public.distrito SET ubigeo = '120412' WHERE id_distrito = 1109 AND ubigeo IS NULL; -- JUNIN / JAUJA / JULCAN
UPDATE public.distrito SET ubigeo = '120414' WHERE id_distrito = 1111 AND ubigeo IS NULL; -- JUNIN / JAUJA / LLOCLLAPAMPA
UPDATE public.distrito SET ubigeo = '120415' WHERE id_distrito = 1112 AND ubigeo IS NULL; -- JUNIN / JAUJA / MARCO
UPDATE public.distrito SET ubigeo = '120416' WHERE id_distrito = 1113 AND ubigeo IS NULL; -- JUNIN / JAUJA / MASMA
UPDATE public.distrito SET ubigeo = '120417' WHERE id_distrito = 1114 AND ubigeo IS NULL; -- JUNIN / JAUJA / MASMA CHICCHE
UPDATE public.distrito SET ubigeo = '120418' WHERE id_distrito = 1115 AND ubigeo IS NULL; -- JUNIN / JAUJA / MOLINOS
UPDATE public.distrito SET ubigeo = '120419' WHERE id_distrito = 1116 AND ubigeo IS NULL; -- JUNIN / JAUJA / MONOBAMBA
UPDATE public.distrito SET ubigeo = '120420' WHERE id_distrito = 1117 AND ubigeo IS NULL; -- JUNIN / JAUJA / MUQUI
UPDATE public.distrito SET ubigeo = '120421' WHERE id_distrito = 1118 AND ubigeo IS NULL; -- JUNIN / JAUJA / MUQUIYAUYO
UPDATE public.distrito SET ubigeo = '120422' WHERE id_distrito = 1119 AND ubigeo IS NULL; -- JUNIN / JAUJA / PACA
UPDATE public.distrito SET ubigeo = '120423' WHERE id_distrito = 1120 AND ubigeo IS NULL; -- JUNIN / JAUJA / PACCHA
UPDATE public.distrito SET ubigeo = '120424' WHERE id_distrito = 1121 AND ubigeo IS NULL; -- JUNIN / JAUJA / PANCAN
UPDATE public.distrito SET ubigeo = '120425' WHERE id_distrito = 1122 AND ubigeo IS NULL; -- JUNIN / JAUJA / PARCO
UPDATE public.distrito SET ubigeo = '120426' WHERE id_distrito = 1123 AND ubigeo IS NULL; -- JUNIN / JAUJA / POMACANCHA
UPDATE public.distrito SET ubigeo = '120427' WHERE id_distrito = 1124 AND ubigeo IS NULL; -- JUNIN / JAUJA / RICRAN
UPDATE public.distrito SET ubigeo = '120428' WHERE id_distrito = 1125 AND ubigeo IS NULL; -- JUNIN / JAUJA / SAN LORENZO
UPDATE public.distrito SET ubigeo = '120429' WHERE id_distrito = 1126 AND ubigeo IS NULL; -- JUNIN / JAUJA / SAN PEDRO DE CHUNAN
UPDATE public.distrito SET ubigeo = '120430' WHERE id_distrito = 1127 AND ubigeo IS NULL; -- JUNIN / JAUJA / SAUSA
UPDATE public.distrito SET ubigeo = '120431' WHERE id_distrito = 1128 AND ubigeo IS NULL; -- JUNIN / JAUJA / SINCOS
UPDATE public.distrito SET ubigeo = '120432' WHERE id_distrito = 1129 AND ubigeo IS NULL; -- JUNIN / JAUJA / TUNAN MARCA
UPDATE public.distrito SET ubigeo = '120433' WHERE id_distrito = 1130 AND ubigeo IS NULL; -- JUNIN / JAUJA / YAULI
UPDATE public.distrito SET ubigeo = '120434' WHERE id_distrito = 1131 AND ubigeo IS NULL; -- JUNIN / JAUJA / YAUYOS
UPDATE public.distrito SET ubigeo = '120501' WHERE id_distrito = 1132 AND ubigeo IS NULL; -- JUNIN / JUNIN / JUNIN
UPDATE public.distrito SET ubigeo = '120502' WHERE id_distrito = 1133 AND ubigeo IS NULL; -- JUNIN / JUNIN / CARHUAMAYO
UPDATE public.distrito SET ubigeo = '120503' WHERE id_distrito = 1134 AND ubigeo IS NULL; -- JUNIN / JUNIN / ONDORES
UPDATE public.distrito SET ubigeo = '120504' WHERE id_distrito = 1135 AND ubigeo IS NULL; -- JUNIN / JUNIN / ULCUMAYO
UPDATE public.distrito SET ubigeo = '120601' WHERE id_distrito = 1136 AND ubigeo IS NULL; -- JUNIN / SATIPO / SATIPO
UPDATE public.distrito SET ubigeo = '120602' WHERE id_distrito = 1137 AND ubigeo IS NULL; -- JUNIN / SATIPO / COVIRIALI
UPDATE public.distrito SET ubigeo = '120603' WHERE id_distrito = 1138 AND ubigeo IS NULL; -- JUNIN / SATIPO / LLAYLLA
UPDATE public.distrito SET ubigeo = '120604' WHERE id_distrito = 1139 AND ubigeo IS NULL; -- JUNIN / SATIPO / MAZAMARI
UPDATE public.distrito SET ubigeo = '120605' WHERE id_distrito = 1140 AND ubigeo IS NULL; -- JUNIN / SATIPO / PAMPA HERMOSA
UPDATE public.distrito SET ubigeo = '120606' WHERE id_distrito = 1141 AND ubigeo IS NULL; -- JUNIN / SATIPO / PANGOA
UPDATE public.distrito SET ubigeo = '120607' WHERE id_distrito = 1142 AND ubigeo IS NULL; -- JUNIN / SATIPO / RIO NEGRO
UPDATE public.distrito SET ubigeo = '120608' WHERE id_distrito = 1143 AND ubigeo IS NULL; -- JUNIN / SATIPO / RIO TAMBO
UPDATE public.distrito SET ubigeo = '120701' WHERE id_distrito = 1145 AND ubigeo IS NULL; -- JUNIN / TARMA / TARMA
UPDATE public.distrito SET ubigeo = '120702' WHERE id_distrito = 1146 AND ubigeo IS NULL; -- JUNIN / TARMA / ACOBAMBA
UPDATE public.distrito SET ubigeo = '120703' WHERE id_distrito = 1147 AND ubigeo IS NULL; -- JUNIN / TARMA / HUARICOLCA
UPDATE public.distrito SET ubigeo = '120704' WHERE id_distrito = 1148 AND ubigeo IS NULL; -- JUNIN / TARMA / HUASAHUASI
UPDATE public.distrito SET ubigeo = '120705' WHERE id_distrito = 1149 AND ubigeo IS NULL; -- JUNIN / TARMA / LA UNION
UPDATE public.distrito SET ubigeo = '120706' WHERE id_distrito = 1150 AND ubigeo IS NULL; -- JUNIN / TARMA / PALCA
UPDATE public.distrito SET ubigeo = '120707' WHERE id_distrito = 1151 AND ubigeo IS NULL; -- JUNIN / TARMA / PALCAMAYO
UPDATE public.distrito SET ubigeo = '120708' WHERE id_distrito = 1152 AND ubigeo IS NULL; -- JUNIN / TARMA / SAN PEDRO DE CAJAS
UPDATE public.distrito SET ubigeo = '120709' WHERE id_distrito = 1153 AND ubigeo IS NULL; -- JUNIN / TARMA / TAPO
UPDATE public.distrito SET ubigeo = '120801' WHERE id_distrito = 1154 AND ubigeo IS NULL; -- JUNIN / YAULI / LA OROYA
UPDATE public.distrito SET ubigeo = '120802' WHERE id_distrito = 1155 AND ubigeo IS NULL; -- JUNIN / YAULI / CHACAPALPA
UPDATE public.distrito SET ubigeo = '120803' WHERE id_distrito = 1156 AND ubigeo IS NULL; -- JUNIN / YAULI / HUAY-HUAY
UPDATE public.distrito SET ubigeo = '120804' WHERE id_distrito = 1157 AND ubigeo IS NULL; -- JUNIN / YAULI / MARCAPOMACOCHA
UPDATE public.distrito SET ubigeo = '120805' WHERE id_distrito = 1158 AND ubigeo IS NULL; -- JUNIN / YAULI / MOROCOCHA
UPDATE public.distrito SET ubigeo = '120806' WHERE id_distrito = 1159 AND ubigeo IS NULL; -- JUNIN / YAULI / PACCHA
UPDATE public.distrito SET ubigeo = '120807' WHERE id_distrito = 1160 AND ubigeo IS NULL; -- JUNIN / YAULI / SANTA BARBARA DE CARHUACAYAN
UPDATE public.distrito SET ubigeo = '120808' WHERE id_distrito = 1161 AND ubigeo IS NULL; -- JUNIN / YAULI / SANTA ROSA DE SACCO
UPDATE public.distrito SET ubigeo = '120809' WHERE id_distrito = 1162 AND ubigeo IS NULL; -- JUNIN / YAULI / SUITUCANCHA
UPDATE public.distrito SET ubigeo = '120810' WHERE id_distrito = 1163 AND ubigeo IS NULL; -- JUNIN / YAULI / YAULI
UPDATE public.distrito SET ubigeo = '120901' WHERE id_distrito = 1164 AND ubigeo IS NULL; -- JUNIN / CHUPACA / CHUPACA
UPDATE public.distrito SET ubigeo = '120902' WHERE id_distrito = 1165 AND ubigeo IS NULL; -- JUNIN / CHUPACA / AHUAC
UPDATE public.distrito SET ubigeo = '120903' WHERE id_distrito = 1166 AND ubigeo IS NULL; -- JUNIN / CHUPACA / CHONGOS BAJO
UPDATE public.distrito SET ubigeo = '120904' WHERE id_distrito = 1167 AND ubigeo IS NULL; -- JUNIN / CHUPACA / HUACHAC
UPDATE public.distrito SET ubigeo = '120905' WHERE id_distrito = 1168 AND ubigeo IS NULL; -- JUNIN / CHUPACA / HUAMANCACA CHICO
UPDATE public.distrito SET ubigeo = '120906' WHERE id_distrito = 1169 AND ubigeo IS NULL; -- JUNIN / CHUPACA / SAN JUAN DE ISCOS
UPDATE public.distrito SET ubigeo = '120907' WHERE id_distrito = 1170 AND ubigeo IS NULL; -- JUNIN / CHUPACA / SAN JUAN DE JARPA
UPDATE public.distrito SET ubigeo = '120908' WHERE id_distrito = 1171 AND ubigeo IS NULL; -- JUNIN / CHUPACA / TRES DE DICIEMBRE
UPDATE public.distrito SET ubigeo = '120909' WHERE id_distrito = 1172 AND ubigeo IS NULL; -- JUNIN / CHUPACA / YANACANCHA
UPDATE public.distrito SET ubigeo = '130101' WHERE id_distrito = 1173 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / TRUJILLO
UPDATE public.distrito SET ubigeo = '130102' WHERE id_distrito = 1174 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / EL PORVENIR
UPDATE public.distrito SET ubigeo = '130103' WHERE id_distrito = 1175 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / FLORENCIA DE MORA
UPDATE public.distrito SET ubigeo = '130104' WHERE id_distrito = 1176 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / HUANCHACO
UPDATE public.distrito SET ubigeo = '130105' WHERE id_distrito = 1177 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / LA ESPERANZA
UPDATE public.distrito SET ubigeo = '130106' WHERE id_distrito = 1178 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / LAREDO
UPDATE public.distrito SET ubigeo = '130107' WHERE id_distrito = 1179 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / MOCHE
UPDATE public.distrito SET ubigeo = '130108' WHERE id_distrito = 1180 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / POROTO
UPDATE public.distrito SET ubigeo = '130109' WHERE id_distrito = 1181 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / SALAVERRY
UPDATE public.distrito SET ubigeo = '130110' WHERE id_distrito = 1182 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / SIMBAL
UPDATE public.distrito SET ubigeo = '130111' WHERE id_distrito = 1183 AND ubigeo IS NULL; -- LA LIBERTAD / TRUJILLO / VICTOR LARCO HERRERA
UPDATE public.distrito SET ubigeo = '130201' WHERE id_distrito = 1185 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / ASCOPE
UPDATE public.distrito SET ubigeo = '130202' WHERE id_distrito = 1186 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / CHICAMA
UPDATE public.distrito SET ubigeo = '130203' WHERE id_distrito = 1187 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / CHOCOPE
UPDATE public.distrito SET ubigeo = '130204' WHERE id_distrito = 1188 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / MAGDALENA DE CAO
UPDATE public.distrito SET ubigeo = '130205' WHERE id_distrito = 1189 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / PAIJAN
UPDATE public.distrito SET ubigeo = '130206' WHERE id_distrito = 1190 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / RAZURI
UPDATE public.distrito SET ubigeo = '130207' WHERE id_distrito = 1191 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / SANTIAGO DE CAO
UPDATE public.distrito SET ubigeo = '130208' WHERE id_distrito = 1192 AND ubigeo IS NULL; -- LA LIBERTAD / ASCOPE / CASA GRANDE
UPDATE public.distrito SET ubigeo = '130301' WHERE id_distrito = 1193 AND ubigeo IS NULL; -- LA LIBERTAD / BOLIVAR / BOLIVAR
UPDATE public.distrito SET ubigeo = '130302' WHERE id_distrito = 1194 AND ubigeo IS NULL; -- LA LIBERTAD / BOLIVAR / BAMBAMARCA
UPDATE public.distrito SET ubigeo = '130304' WHERE id_distrito = 1196 AND ubigeo IS NULL; -- LA LIBERTAD / BOLIVAR / LONGOTEA
UPDATE public.distrito SET ubigeo = '130305' WHERE id_distrito = 1197 AND ubigeo IS NULL; -- LA LIBERTAD / BOLIVAR / UCHUMARCA
UPDATE public.distrito SET ubigeo = '130306' WHERE id_distrito = 1198 AND ubigeo IS NULL; -- LA LIBERTAD / BOLIVAR / UCUNCHA
UPDATE public.distrito SET ubigeo = '130401' WHERE id_distrito = 1199 AND ubigeo IS NULL; -- LA LIBERTAD / CHEPEN / CHEPEN
UPDATE public.distrito SET ubigeo = '130402' WHERE id_distrito = 1200 AND ubigeo IS NULL; -- LA LIBERTAD / CHEPEN / PACANGA
UPDATE public.distrito SET ubigeo = '130403' WHERE id_distrito = 1201 AND ubigeo IS NULL; -- LA LIBERTAD / CHEPEN / PUEBLO NUEVO
UPDATE public.distrito SET ubigeo = '130501' WHERE id_distrito = 1202 AND ubigeo IS NULL; -- LA LIBERTAD / JULCAN / JULCAN
UPDATE public.distrito SET ubigeo = '130502' WHERE id_distrito = 1203 AND ubigeo IS NULL; -- LA LIBERTAD / JULCAN / CALAMARCA
UPDATE public.distrito SET ubigeo = '130503' WHERE id_distrito = 1204 AND ubigeo IS NULL; -- LA LIBERTAD / JULCAN / CARABAMBA
UPDATE public.distrito SET ubigeo = '130504' WHERE id_distrito = 1205 AND ubigeo IS NULL; -- LA LIBERTAD / JULCAN / HUASO
UPDATE public.distrito SET ubigeo = '130601' WHERE id_distrito = 1206 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / OTUZCO
UPDATE public.distrito SET ubigeo = '130602' WHERE id_distrito = 1207 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / AGALLPAMPA
UPDATE public.distrito SET ubigeo = '130604' WHERE id_distrito = 1208 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / CHARAT
UPDATE public.distrito SET ubigeo = '130605' WHERE id_distrito = 1209 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / HUARANCHAL
UPDATE public.distrito SET ubigeo = '130606' WHERE id_distrito = 1210 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / LA CUESTA
UPDATE public.distrito SET ubigeo = '130608' WHERE id_distrito = 1211 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / MACHE
UPDATE public.distrito SET ubigeo = '130610' WHERE id_distrito = 1212 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / PARANDAY
UPDATE public.distrito SET ubigeo = '130611' WHERE id_distrito = 1213 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / SALPO
UPDATE public.distrito SET ubigeo = '130613' WHERE id_distrito = 1214 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / SINSICAP
UPDATE public.distrito SET ubigeo = '130614' WHERE id_distrito = 1215 AND ubigeo IS NULL; -- LA LIBERTAD / OTUZCO / USQUIL
UPDATE public.distrito SET ubigeo = '130701' WHERE id_distrito = 1216 AND ubigeo IS NULL; -- LA LIBERTAD / PACASMAYO / SAN PEDRO DE LLOC
UPDATE public.distrito SET ubigeo = '130702' WHERE id_distrito = 1217 AND ubigeo IS NULL; -- LA LIBERTAD / PACASMAYO / GUADALUPE
UPDATE public.distrito SET ubigeo = '130703' WHERE id_distrito = 1218 AND ubigeo IS NULL; -- LA LIBERTAD / PACASMAYO / JEQUETEPEQUE
UPDATE public.distrito SET ubigeo = '130704' WHERE id_distrito = 1219 AND ubigeo IS NULL; -- LA LIBERTAD / PACASMAYO / PACASMAYO
UPDATE public.distrito SET ubigeo = '130705' WHERE id_distrito = 1220 AND ubigeo IS NULL; -- LA LIBERTAD / PACASMAYO / SAN JOSE
UPDATE public.distrito SET ubigeo = '130801' WHERE id_distrito = 1221 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / TAYABAMBA
UPDATE public.distrito SET ubigeo = '130802' WHERE id_distrito = 1222 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / BULDIBUYO
UPDATE public.distrito SET ubigeo = '130803' WHERE id_distrito = 1223 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / CHILLIA
UPDATE public.distrito SET ubigeo = '130804' WHERE id_distrito = 1224 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / HUANCASPATA
UPDATE public.distrito SET ubigeo = '130805' WHERE id_distrito = 1225 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / HUAYLILLAS
UPDATE public.distrito SET ubigeo = '130806' WHERE id_distrito = 1226 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / HUAYO
UPDATE public.distrito SET ubigeo = '130807' WHERE id_distrito = 1227 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / ONGON
UPDATE public.distrito SET ubigeo = '130808' WHERE id_distrito = 1228 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / PARCOY
UPDATE public.distrito SET ubigeo = '130809' WHERE id_distrito = 1229 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / PATAZ
UPDATE public.distrito SET ubigeo = '130810' WHERE id_distrito = 1230 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / PIAS
UPDATE public.distrito SET ubigeo = '130811' WHERE id_distrito = 1231 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / SANTIAGO DE CHALLAS
UPDATE public.distrito SET ubigeo = '130812' WHERE id_distrito = 1232 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / TAURIJA
UPDATE public.distrito SET ubigeo = '130813' WHERE id_distrito = 1233 AND ubigeo IS NULL; -- LA LIBERTAD / PATAZ / URPAY
UPDATE public.distrito SET ubigeo = '130901' WHERE id_distrito = 1234 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / HUAMACHUCO
UPDATE public.distrito SET ubigeo = '130902' WHERE id_distrito = 1235 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / CHUGAY
UPDATE public.distrito SET ubigeo = '130903' WHERE id_distrito = 1236 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / COCHORCO
UPDATE public.distrito SET ubigeo = '130904' WHERE id_distrito = 1237 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / CURGOS
UPDATE public.distrito SET ubigeo = '130905' WHERE id_distrito = 1238 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / MARCABAL
UPDATE public.distrito SET ubigeo = '130906' WHERE id_distrito = 1239 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / SANAGORAN
UPDATE public.distrito SET ubigeo = '130907' WHERE id_distrito = 1240 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / SARIN
UPDATE public.distrito SET ubigeo = '130908' WHERE id_distrito = 1241 AND ubigeo IS NULL; -- LA LIBERTAD / SANCHEZ CARRION / SARTIMBAMBA
UPDATE public.distrito SET ubigeo = '131001' WHERE id_distrito = 1242 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / SANTIAGO DE CHUCO
UPDATE public.distrito SET ubigeo = '131002' WHERE id_distrito = 1243 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / ANGASMARCA
UPDATE public.distrito SET ubigeo = '131003' WHERE id_distrito = 1244 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / CACHICADAN
UPDATE public.distrito SET ubigeo = '131004' WHERE id_distrito = 1245 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / MOLLEBAMBA
UPDATE public.distrito SET ubigeo = '131005' WHERE id_distrito = 1246 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / MOLLEPATA
UPDATE public.distrito SET ubigeo = '131006' WHERE id_distrito = 1247 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / QUIRUVILCA
UPDATE public.distrito SET ubigeo = '131007' WHERE id_distrito = 1248 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / SANTA CRUZ DE CHUCA
UPDATE public.distrito SET ubigeo = '131008' WHERE id_distrito = 1249 AND ubigeo IS NULL; -- LA LIBERTAD / SANTIAGO DE CHUCO / SITABAMBA
UPDATE public.distrito SET ubigeo = '131101' WHERE id_distrito = 1250 AND ubigeo IS NULL; -- LA LIBERTAD / GRAN CHIMU / CASCAS
UPDATE public.distrito SET ubigeo = '131102' WHERE id_distrito = 1251 AND ubigeo IS NULL; -- LA LIBERTAD / GRAN CHIMU / LUCMA
UPDATE public.distrito SET ubigeo = '131104' WHERE id_distrito = 1253 AND ubigeo IS NULL; -- LA LIBERTAD / GRAN CHIMU / SAYAPULLO
UPDATE public.distrito SET ubigeo = '131201' WHERE id_distrito = 1254 AND ubigeo IS NULL; -- LA LIBERTAD / VIRU / VIRU
UPDATE public.distrito SET ubigeo = '131202' WHERE id_distrito = 1255 AND ubigeo IS NULL; -- LA LIBERTAD / VIRU / CHAO
UPDATE public.distrito SET ubigeo = '131203' WHERE id_distrito = 1256 AND ubigeo IS NULL; -- LA LIBERTAD / VIRU / GUADALUPITO
UPDATE public.distrito SET ubigeo = '140101' WHERE id_distrito = 1257 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / CHICLAYO
UPDATE public.distrito SET ubigeo = '140102' WHERE id_distrito = 1258 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / CHONGOYAPE
UPDATE public.distrito SET ubigeo = '140103' WHERE id_distrito = 1259 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / ETEN
UPDATE public.distrito SET ubigeo = '140104' WHERE id_distrito = 1260 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / ETEN PUERTO
UPDATE public.distrito SET ubigeo = '140105' WHERE id_distrito = 1261 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / JOSE LEONARDO ORTIZ
UPDATE public.distrito SET ubigeo = '140106' WHERE id_distrito = 1262 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / LA VICTORIA
UPDATE public.distrito SET ubigeo = '140107' WHERE id_distrito = 1263 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / LAGUNAS
UPDATE public.distrito SET ubigeo = '140108' WHERE id_distrito = 1264 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / MONSEFU
UPDATE public.distrito SET ubigeo = '140109' WHERE id_distrito = 1265 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / NUEVA ARICA
UPDATE public.distrito SET ubigeo = '140110' WHERE id_distrito = 1266 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / OYOTUN
UPDATE public.distrito SET ubigeo = '140111' WHERE id_distrito = 1267 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / PICSI
UPDATE public.distrito SET ubigeo = '140112' WHERE id_distrito = 1268 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / PIMENTEL
UPDATE public.distrito SET ubigeo = '140113' WHERE id_distrito = 1269 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / REQUE
UPDATE public.distrito SET ubigeo = '140114' WHERE id_distrito = 1270 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / SANTA ROSA
UPDATE public.distrito SET ubigeo = '140116' WHERE id_distrito = 1272 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / CAYALTI
UPDATE public.distrito SET ubigeo = '140117' WHERE id_distrito = 1273 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / PATAPO
UPDATE public.distrito SET ubigeo = '140118' WHERE id_distrito = 1274 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / POMALCA
UPDATE public.distrito SET ubigeo = '140119' WHERE id_distrito = 1275 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / PUCALA
UPDATE public.distrito SET ubigeo = '140120' WHERE id_distrito = 1276 AND ubigeo IS NULL; -- LAMBAYEQUE / CHICLAYO / TUMAN
UPDATE public.distrito SET ubigeo = '140301' WHERE id_distrito = 1283 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / LAMBAYEQUE
UPDATE public.distrito SET ubigeo = '140302' WHERE id_distrito = 1284 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / CHOCHOPE
UPDATE public.distrito SET ubigeo = '140303' WHERE id_distrito = 1285 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / ILLIMO
UPDATE public.distrito SET ubigeo = '140304' WHERE id_distrito = 1286 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / JAYANCA
UPDATE public.distrito SET ubigeo = '140305' WHERE id_distrito = 1287 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / MOCHUMI
UPDATE public.distrito SET ubigeo = '140306' WHERE id_distrito = 1288 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / MORROPE
UPDATE public.distrito SET ubigeo = '140307' WHERE id_distrito = 1289 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / MOTUPE
UPDATE public.distrito SET ubigeo = '140308' WHERE id_distrito = 1290 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / OLMOS
UPDATE public.distrito SET ubigeo = '140309' WHERE id_distrito = 1291 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / PACORA
UPDATE public.distrito SET ubigeo = '140310' WHERE id_distrito = 1292 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / SALAS
UPDATE public.distrito SET ubigeo = '140311' WHERE id_distrito = 1293 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / SAN JOSE
UPDATE public.distrito SET ubigeo = '140312' WHERE id_distrito = 1294 AND ubigeo IS NULL; -- LAMBAYEQUE / LAMBAYEQUE / TUCUME
UPDATE public.distrito SET ubigeo = '150101' WHERE id_distrito = 1295 AND ubigeo IS NULL; -- LIMA / LIMA / LIMA
UPDATE public.distrito SET ubigeo = '150102' WHERE id_distrito = 1296 AND ubigeo IS NULL; -- LIMA / LIMA / ANCON
UPDATE public.distrito SET ubigeo = '150103' WHERE id_distrito = 1297 AND ubigeo IS NULL; -- LIMA / LIMA / ATE
UPDATE public.distrito SET ubigeo = '150104' WHERE id_distrito = 1298 AND ubigeo IS NULL; -- LIMA / LIMA / BARRANCO
UPDATE public.distrito SET ubigeo = '150106' WHERE id_distrito = 1300 AND ubigeo IS NULL; -- LIMA / LIMA / CARABAYLLO
UPDATE public.distrito SET ubigeo = '150107' WHERE id_distrito = 1301 AND ubigeo IS NULL; -- LIMA / LIMA / CHACLACAYO
UPDATE public.distrito SET ubigeo = '150108' WHERE id_distrito = 1302 AND ubigeo IS NULL; -- LIMA / LIMA / CHORRILLOS
UPDATE public.distrito SET ubigeo = '150109' WHERE id_distrito = 1303 AND ubigeo IS NULL; -- LIMA / LIMA / CIENEGUILLA
UPDATE public.distrito SET ubigeo = '150110' WHERE id_distrito = 1304 AND ubigeo IS NULL; -- LIMA / LIMA / COMAS
UPDATE public.distrito SET ubigeo = '150111' WHERE id_distrito = 1305 AND ubigeo IS NULL; -- LIMA / LIMA / EL AGUSTINO
UPDATE public.distrito SET ubigeo = '150112' WHERE id_distrito = 1306 AND ubigeo IS NULL; -- LIMA / LIMA / INDEPENDENCIA
UPDATE public.distrito SET ubigeo = '150113' WHERE id_distrito = 1307 AND ubigeo IS NULL; -- LIMA / LIMA / JESUS MARIA
UPDATE public.distrito SET ubigeo = '150114' WHERE id_distrito = 1308 AND ubigeo IS NULL; -- LIMA / LIMA / LA MOLINA
UPDATE public.distrito SET ubigeo = '150115' WHERE id_distrito = 1309 AND ubigeo IS NULL; -- LIMA / LIMA / LA VICTORIA
UPDATE public.distrito SET ubigeo = '150116' WHERE id_distrito = 1310 AND ubigeo IS NULL; -- LIMA / LIMA / LINCE
UPDATE public.distrito SET ubigeo = '150117' WHERE id_distrito = 1311 AND ubigeo IS NULL; -- LIMA / LIMA / LOS OLIVOS
UPDATE public.distrito SET ubigeo = '150118' WHERE id_distrito = 1312 AND ubigeo IS NULL; -- LIMA / LIMA / LURIGANCHO
UPDATE public.distrito SET ubigeo = '150119' WHERE id_distrito = 1313 AND ubigeo IS NULL; -- LIMA / LIMA / LURIN
UPDATE public.distrito SET ubigeo = '150120' WHERE id_distrito = 1314 AND ubigeo IS NULL; -- LIMA / LIMA / MAGDALENA DEL MAR
UPDATE public.distrito SET ubigeo = '150121' WHERE id_distrito = 1315 AND ubigeo IS NULL; -- LIMA / LIMA / PUEBLO LIBRE
UPDATE public.distrito SET ubigeo = '150123' WHERE id_distrito = 1316 AND ubigeo IS NULL; -- LIMA / LIMA / PACHACAMAC
UPDATE public.distrito SET ubigeo = '150124' WHERE id_distrito = 1317 AND ubigeo IS NULL; -- LIMA / LIMA / PUCUSANA
UPDATE public.distrito SET ubigeo = '150125' WHERE id_distrito = 1318 AND ubigeo IS NULL; -- LIMA / LIMA / PUENTE PIEDRA
UPDATE public.distrito SET ubigeo = '150126' WHERE id_distrito = 1319 AND ubigeo IS NULL; -- LIMA / LIMA / PUNTA HERMOSA
UPDATE public.distrito SET ubigeo = '150127' WHERE id_distrito = 1320 AND ubigeo IS NULL; -- LIMA / LIMA / PUNTA NEGRA
UPDATE public.distrito SET ubigeo = '150128' WHERE id_distrito = 1321 AND ubigeo IS NULL; -- LIMA / LIMA / RIMAC
UPDATE public.distrito SET ubigeo = '150129' WHERE id_distrito = 1322 AND ubigeo IS NULL; -- LIMA / LIMA / SAN BARTOLO
UPDATE public.distrito SET ubigeo = '150130' WHERE id_distrito = 1323 AND ubigeo IS NULL; -- LIMA / LIMA / SAN BORJA
UPDATE public.distrito SET ubigeo = '150131' WHERE id_distrito = 1324 AND ubigeo IS NULL; -- LIMA / LIMA / SAN ISIDRO
UPDATE public.distrito SET ubigeo = '150132' WHERE id_distrito = 1325 AND ubigeo IS NULL; -- LIMA / LIMA / SAN JUAN DE LURIGANCHO
UPDATE public.distrito SET ubigeo = '150133' WHERE id_distrito = 1326 AND ubigeo IS NULL; -- LIMA / LIMA / SAN JUAN DE MIRAFLORES
UPDATE public.distrito SET ubigeo = '150134' WHERE id_distrito = 1327 AND ubigeo IS NULL; -- LIMA / LIMA / SAN LUIS
UPDATE public.distrito SET ubigeo = '150135' WHERE id_distrito = 1328 AND ubigeo IS NULL; -- LIMA / LIMA / SAN MARTIN DE PORRES
UPDATE public.distrito SET ubigeo = '150136' WHERE id_distrito = 1329 AND ubigeo IS NULL; -- LIMA / LIMA / SAN MIGUEL
UPDATE public.distrito SET ubigeo = '150137' WHERE id_distrito = 1330 AND ubigeo IS NULL; -- LIMA / LIMA / SANTA ANITA
UPDATE public.distrito SET ubigeo = '150138' WHERE id_distrito = 1331 AND ubigeo IS NULL; -- LIMA / LIMA / SANTA MARIA DEL MAR
UPDATE public.distrito SET ubigeo = '150139' WHERE id_distrito = 1332 AND ubigeo IS NULL; -- LIMA / LIMA / SANTA ROSA
UPDATE public.distrito SET ubigeo = '150140' WHERE id_distrito = 1333 AND ubigeo IS NULL; -- LIMA / LIMA / SANTIAGO DE SURCO
UPDATE public.distrito SET ubigeo = '150141' WHERE id_distrito = 1334 AND ubigeo IS NULL; -- LIMA / LIMA / SURQUILLO
UPDATE public.distrito SET ubigeo = '150142' WHERE id_distrito = 1335 AND ubigeo IS NULL; -- LIMA / LIMA / VILLA EL SALVADOR
UPDATE public.distrito SET ubigeo = '150143' WHERE id_distrito = 1336 AND ubigeo IS NULL; -- LIMA / LIMA / VILLA MARIA DEL TRIUNFO
UPDATE public.distrito SET ubigeo = '150201' WHERE id_distrito = 1337 AND ubigeo IS NULL; -- LIMA / BARRANCA / BARRANCA
UPDATE public.distrito SET ubigeo = '150202' WHERE id_distrito = 1338 AND ubigeo IS NULL; -- LIMA / BARRANCA / PARAMONGA
UPDATE public.distrito SET ubigeo = '150203' WHERE id_distrito = 1339 AND ubigeo IS NULL; -- LIMA / BARRANCA / PATIVILCA
UPDATE public.distrito SET ubigeo = '150204' WHERE id_distrito = 1340 AND ubigeo IS NULL; -- LIMA / BARRANCA / SUPE
UPDATE public.distrito SET ubigeo = '150205' WHERE id_distrito = 1341 AND ubigeo IS NULL; -- LIMA / BARRANCA / SUPE PUERTO
UPDATE public.distrito SET ubigeo = '150301' WHERE id_distrito = 1342 AND ubigeo IS NULL; -- LIMA / CAJATAMBO / CAJATAMBO
UPDATE public.distrito SET ubigeo = '150302' WHERE id_distrito = 1343 AND ubigeo IS NULL; -- LIMA / CAJATAMBO / COPA
UPDATE public.distrito SET ubigeo = '150303' WHERE id_distrito = 1344 AND ubigeo IS NULL; -- LIMA / CAJATAMBO / GORGOR
UPDATE public.distrito SET ubigeo = '150304' WHERE id_distrito = 1345 AND ubigeo IS NULL; -- LIMA / CAJATAMBO / HUANCAPON
UPDATE public.distrito SET ubigeo = '150305' WHERE id_distrito = 1346 AND ubigeo IS NULL; -- LIMA / CAJATAMBO / MANAS
UPDATE public.distrito SET ubigeo = '150401' WHERE id_distrito = 1347 AND ubigeo IS NULL; -- LIMA / CANTA / CANTA
UPDATE public.distrito SET ubigeo = '150402' WHERE id_distrito = 1348 AND ubigeo IS NULL; -- LIMA / CANTA / ARAHUAY
UPDATE public.distrito SET ubigeo = '150403' WHERE id_distrito = 1349 AND ubigeo IS NULL; -- LIMA / CANTA / HUAMANTANGA
UPDATE public.distrito SET ubigeo = '150404' WHERE id_distrito = 1350 AND ubigeo IS NULL; -- LIMA / CANTA / HUAROS
UPDATE public.distrito SET ubigeo = '150405' WHERE id_distrito = 1351 AND ubigeo IS NULL; -- LIMA / CANTA / LACHAQUI
UPDATE public.distrito SET ubigeo = '150406' WHERE id_distrito = 1352 AND ubigeo IS NULL; -- LIMA / CANTA / SAN BUENAVENTURA
UPDATE public.distrito SET ubigeo = '150407' WHERE id_distrito = 1353 AND ubigeo IS NULL; -- LIMA / CANTA / SANTA ROSA DE QUIVES
UPDATE public.distrito SET ubigeo = '150601' WHERE id_distrito = 1370 AND ubigeo IS NULL; -- LIMA / HUARAL / HUARAL
UPDATE public.distrito SET ubigeo = '150602' WHERE id_distrito = 1371 AND ubigeo IS NULL; -- LIMA / HUARAL / ATAVILLOS ALTO
UPDATE public.distrito SET ubigeo = '150603' WHERE id_distrito = 1372 AND ubigeo IS NULL; -- LIMA / HUARAL / ATAVILLOS BAJO
UPDATE public.distrito SET ubigeo = '150604' WHERE id_distrito = 1373 AND ubigeo IS NULL; -- LIMA / HUARAL / AUCALLAMA
UPDATE public.distrito SET ubigeo = '150605' WHERE id_distrito = 1374 AND ubigeo IS NULL; -- LIMA / HUARAL / CHANCAY
UPDATE public.distrito SET ubigeo = '150606' WHERE id_distrito = 1375 AND ubigeo IS NULL; -- LIMA / HUARAL / IHUARI
UPDATE public.distrito SET ubigeo = '150607' WHERE id_distrito = 1376 AND ubigeo IS NULL; -- LIMA / HUARAL / LAMPIAN
UPDATE public.distrito SET ubigeo = '150608' WHERE id_distrito = 1377 AND ubigeo IS NULL; -- LIMA / HUARAL / PACARAOS
UPDATE public.distrito SET ubigeo = '150609' WHERE id_distrito = 1378 AND ubigeo IS NULL; -- LIMA / HUARAL / SAN MIGUEL DE ACOS
UPDATE public.distrito SET ubigeo = '150610' WHERE id_distrito = 1379 AND ubigeo IS NULL; -- LIMA / HUARAL / SANTA CRUZ DE ANDAMARCA
UPDATE public.distrito SET ubigeo = '150611' WHERE id_distrito = 1380 AND ubigeo IS NULL; -- LIMA / HUARAL / SUMBILCA
UPDATE public.distrito SET ubigeo = '150612' WHERE id_distrito = 1381 AND ubigeo IS NULL; -- LIMA / HUARAL / VEINTISIETE DE NOVIEMBRE
UPDATE public.distrito SET ubigeo = '150701' WHERE id_distrito = 1382 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / MATUCANA
UPDATE public.distrito SET ubigeo = '150702' WHERE id_distrito = 1383 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / ANTIOQUIA
UPDATE public.distrito SET ubigeo = '150703' WHERE id_distrito = 1384 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / CALLAHUANCA
UPDATE public.distrito SET ubigeo = '150704' WHERE id_distrito = 1385 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / CARAMPOMA
UPDATE public.distrito SET ubigeo = '150705' WHERE id_distrito = 1386 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / CHICLA
UPDATE public.distrito SET ubigeo = '150706' WHERE id_distrito = 1387 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / CUENCA
UPDATE public.distrito SET ubigeo = '150707' WHERE id_distrito = 1388 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / HUACHUPAMPA
UPDATE public.distrito SET ubigeo = '150708' WHERE id_distrito = 1389 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / HUANZA
UPDATE public.distrito SET ubigeo = '150709' WHERE id_distrito = 1390 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / HUAROCHIRI
UPDATE public.distrito SET ubigeo = '150710' WHERE id_distrito = 1391 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / LAHUAYTAMBO
UPDATE public.distrito SET ubigeo = '150711' WHERE id_distrito = 1392 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / LANGA
UPDATE public.distrito SET ubigeo = '150713' WHERE id_distrito = 1394 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / MARIATANA
UPDATE public.distrito SET ubigeo = '150714' WHERE id_distrito = 1395 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / RICARDO PALMA
UPDATE public.distrito SET ubigeo = '150715' WHERE id_distrito = 1396 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN ANDRES DE TUPICOCHA
UPDATE public.distrito SET ubigeo = '150716' WHERE id_distrito = 1397 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN ANTONIO
UPDATE public.distrito SET ubigeo = '150717' WHERE id_distrito = 1398 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN BARTOLOME
UPDATE public.distrito SET ubigeo = '150718' WHERE id_distrito = 1399 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN DAMIAN
UPDATE public.distrito SET ubigeo = '150719' WHERE id_distrito = 1400 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN JUAN DE IRIS
UPDATE public.distrito SET ubigeo = '150720' WHERE id_distrito = 1401 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN JUAN DE TANTARANCHE
UPDATE public.distrito SET ubigeo = '150721' WHERE id_distrito = 1402 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN LORENZO DE QUINTI
UPDATE public.distrito SET ubigeo = '150722' WHERE id_distrito = 1403 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN MATEO
UPDATE public.distrito SET ubigeo = '150723' WHERE id_distrito = 1404 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN MATEO DE OTAO
UPDATE public.distrito SET ubigeo = '150724' WHERE id_distrito = 1405 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN PEDRO DE CASTA
UPDATE public.distrito SET ubigeo = '150725' WHERE id_distrito = 1406 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SAN PEDRO DE HUANCAYRE
UPDATE public.distrito SET ubigeo = '150726' WHERE id_distrito = 1407 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SANGALLAYA
UPDATE public.distrito SET ubigeo = '150727' WHERE id_distrito = 1408 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SANTA CRUZ DE COCACHACRA
UPDATE public.distrito SET ubigeo = '150728' WHERE id_distrito = 1409 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SANTA EULALIA
UPDATE public.distrito SET ubigeo = '150729' WHERE id_distrito = 1410 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SANTIAGO DE ANCHUCAYA
UPDATE public.distrito SET ubigeo = '150730' WHERE id_distrito = 1411 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SANTIAGO DE TUNA
UPDATE public.distrito SET ubigeo = '150731' WHERE id_distrito = 1412 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SANTO DOMINGO DE LOS OLLEROS
UPDATE public.distrito SET ubigeo = '150732' WHERE id_distrito = 1413 AND ubigeo IS NULL; -- LIMA / HUAROCHIRI / SURCO
UPDATE public.distrito SET ubigeo = '150801' WHERE id_distrito = 1414 AND ubigeo IS NULL; -- LIMA / HUAURA / HUACHO
UPDATE public.distrito SET ubigeo = '150802' WHERE id_distrito = 1415 AND ubigeo IS NULL; -- LIMA / HUAURA / AMBAR
UPDATE public.distrito SET ubigeo = '150803' WHERE id_distrito = 1416 AND ubigeo IS NULL; -- LIMA / HUAURA / CALETA DE CARQUIN
UPDATE public.distrito SET ubigeo = '150804' WHERE id_distrito = 1417 AND ubigeo IS NULL; -- LIMA / HUAURA / CHECRAS
UPDATE public.distrito SET ubigeo = '150805' WHERE id_distrito = 1418 AND ubigeo IS NULL; -- LIMA / HUAURA / HUALMAY
UPDATE public.distrito SET ubigeo = '150806' WHERE id_distrito = 1419 AND ubigeo IS NULL; -- LIMA / HUAURA / HUAURA
UPDATE public.distrito SET ubigeo = '150807' WHERE id_distrito = 1420 AND ubigeo IS NULL; -- LIMA / HUAURA / LEONCIO PRADO
UPDATE public.distrito SET ubigeo = '150808' WHERE id_distrito = 1421 AND ubigeo IS NULL; -- LIMA / HUAURA / PACCHO
UPDATE public.distrito SET ubigeo = '150809' WHERE id_distrito = 1422 AND ubigeo IS NULL; -- LIMA / HUAURA / SANTA LEONOR
UPDATE public.distrito SET ubigeo = '150810' WHERE id_distrito = 1423 AND ubigeo IS NULL; -- LIMA / HUAURA / SANTA MARIA
UPDATE public.distrito SET ubigeo = '150811' WHERE id_distrito = 1424 AND ubigeo IS NULL; -- LIMA / HUAURA / SAYAN
UPDATE public.distrito SET ubigeo = '150812' WHERE id_distrito = 1425 AND ubigeo IS NULL; -- LIMA / HUAURA / VEGUETA
UPDATE public.distrito SET ubigeo = '150901' WHERE id_distrito = 1426 AND ubigeo IS NULL; -- LIMA / OYON / OYON
UPDATE public.distrito SET ubigeo = '150902' WHERE id_distrito = 1427 AND ubigeo IS NULL; -- LIMA / OYON / ANDAJES
UPDATE public.distrito SET ubigeo = '150903' WHERE id_distrito = 1428 AND ubigeo IS NULL; -- LIMA / OYON / CAUJUL
UPDATE public.distrito SET ubigeo = '150904' WHERE id_distrito = 1429 AND ubigeo IS NULL; -- LIMA / OYON / COCHAMARCA
UPDATE public.distrito SET ubigeo = '150905' WHERE id_distrito = 1430 AND ubigeo IS NULL; -- LIMA / OYON / NAVAN
UPDATE public.distrito SET ubigeo = '150906' WHERE id_distrito = 1431 AND ubigeo IS NULL; -- LIMA / OYON / PACHANGARA
UPDATE public.distrito SET ubigeo = '151001' WHERE id_distrito = 1432 AND ubigeo IS NULL; -- LIMA / YAUYOS / YAUYOS
UPDATE public.distrito SET ubigeo = '151002' WHERE id_distrito = 1433 AND ubigeo IS NULL; -- LIMA / YAUYOS / ALIS
UPDATE public.distrito SET ubigeo = '151003' WHERE id_distrito = 1434 AND ubigeo IS NULL; -- LIMA / YAUYOS / ALLAUCA
UPDATE public.distrito SET ubigeo = '151004' WHERE id_distrito = 1435 AND ubigeo IS NULL; -- LIMA / YAUYOS / AYAVIRI
UPDATE public.distrito SET ubigeo = '151005' WHERE id_distrito = 1436 AND ubigeo IS NULL; -- LIMA / YAUYOS / AZANGARO
UPDATE public.distrito SET ubigeo = '151006' WHERE id_distrito = 1437 AND ubigeo IS NULL; -- LIMA / YAUYOS / CACRA
UPDATE public.distrito SET ubigeo = '151007' WHERE id_distrito = 1438 AND ubigeo IS NULL; -- LIMA / YAUYOS / CARANIA
UPDATE public.distrito SET ubigeo = '151008' WHERE id_distrito = 1439 AND ubigeo IS NULL; -- LIMA / YAUYOS / CATAHUASI
UPDATE public.distrito SET ubigeo = '151009' WHERE id_distrito = 1440 AND ubigeo IS NULL; -- LIMA / YAUYOS / CHOCOS
UPDATE public.distrito SET ubigeo = '151010' WHERE id_distrito = 1441 AND ubigeo IS NULL; -- LIMA / YAUYOS / COCHAS
UPDATE public.distrito SET ubigeo = '151011' WHERE id_distrito = 1442 AND ubigeo IS NULL; -- LIMA / YAUYOS / COLONIA
UPDATE public.distrito SET ubigeo = '151012' WHERE id_distrito = 1443 AND ubigeo IS NULL; -- LIMA / YAUYOS / HONGOS
UPDATE public.distrito SET ubigeo = '151013' WHERE id_distrito = 1444 AND ubigeo IS NULL; -- LIMA / YAUYOS / HUAMPARA
UPDATE public.distrito SET ubigeo = '151014' WHERE id_distrito = 1445 AND ubigeo IS NULL; -- LIMA / YAUYOS / HUANCAYA
UPDATE public.distrito SET ubigeo = '151015' WHERE id_distrito = 1446 AND ubigeo IS NULL; -- LIMA / YAUYOS / HUANGASCAR
UPDATE public.distrito SET ubigeo = '151016' WHERE id_distrito = 1447 AND ubigeo IS NULL; -- LIMA / YAUYOS / HUANTAN
UPDATE public.distrito SET ubigeo = '151018' WHERE id_distrito = 1449 AND ubigeo IS NULL; -- LIMA / YAUYOS / LARAOS
UPDATE public.distrito SET ubigeo = '151019' WHERE id_distrito = 1450 AND ubigeo IS NULL; -- LIMA / YAUYOS / LINCHA
UPDATE public.distrito SET ubigeo = '151020' WHERE id_distrito = 1451 AND ubigeo IS NULL; -- LIMA / YAUYOS / MADEAN
UPDATE public.distrito SET ubigeo = '151021' WHERE id_distrito = 1452 AND ubigeo IS NULL; -- LIMA / YAUYOS / MIRAFLORES
UPDATE public.distrito SET ubigeo = '151022' WHERE id_distrito = 1453 AND ubigeo IS NULL; -- LIMA / YAUYOS / OMAS
UPDATE public.distrito SET ubigeo = '151023' WHERE id_distrito = 1454 AND ubigeo IS NULL; -- LIMA / YAUYOS / PUTINZA
UPDATE public.distrito SET ubigeo = '151024' WHERE id_distrito = 1455 AND ubigeo IS NULL; -- LIMA / YAUYOS / QUINCHES
UPDATE public.distrito SET ubigeo = '151025' WHERE id_distrito = 1456 AND ubigeo IS NULL; -- LIMA / YAUYOS / QUINOCAY
UPDATE public.distrito SET ubigeo = '151026' WHERE id_distrito = 1457 AND ubigeo IS NULL; -- LIMA / YAUYOS / SAN JOAQUIN
UPDATE public.distrito SET ubigeo = '151027' WHERE id_distrito = 1458 AND ubigeo IS NULL; -- LIMA / YAUYOS / SAN PEDRO DE PILAS
UPDATE public.distrito SET ubigeo = '151028' WHERE id_distrito = 1459 AND ubigeo IS NULL; -- LIMA / YAUYOS / TANTA
UPDATE public.distrito SET ubigeo = '151029' WHERE id_distrito = 1460 AND ubigeo IS NULL; -- LIMA / YAUYOS / TAURIPAMPA
UPDATE public.distrito SET ubigeo = '151030' WHERE id_distrito = 1461 AND ubigeo IS NULL; -- LIMA / YAUYOS / TOMAS
UPDATE public.distrito SET ubigeo = '151031' WHERE id_distrito = 1462 AND ubigeo IS NULL; -- LIMA / YAUYOS / TUPE
UPDATE public.distrito SET ubigeo = '151033' WHERE id_distrito = 1464 AND ubigeo IS NULL; -- LIMA / YAUYOS / VITIS
UPDATE public.distrito SET ubigeo = '160101' WHERE id_distrito = 1465 AND ubigeo IS NULL; -- LORETO / MAYNAS / IQUITOS
UPDATE public.distrito SET ubigeo = '160102' WHERE id_distrito = 1466 AND ubigeo IS NULL; -- LORETO / MAYNAS / ALTO NANAY
UPDATE public.distrito SET ubigeo = '160103' WHERE id_distrito = 1467 AND ubigeo IS NULL; -- LORETO / MAYNAS / FERNANDO LORES
UPDATE public.distrito SET ubigeo = '160104' WHERE id_distrito = 1468 AND ubigeo IS NULL; -- LORETO / MAYNAS / INDIANA
UPDATE public.distrito SET ubigeo = '160105' WHERE id_distrito = 1469 AND ubigeo IS NULL; -- LORETO / MAYNAS / LAS AMAZONAS
UPDATE public.distrito SET ubigeo = '160106' WHERE id_distrito = 1470 AND ubigeo IS NULL; -- LORETO / MAYNAS / MAZAN
UPDATE public.distrito SET ubigeo = '160107' WHERE id_distrito = 1471 AND ubigeo IS NULL; -- LORETO / MAYNAS / NAPO
UPDATE public.distrito SET ubigeo = '160108' WHERE id_distrito = 1472 AND ubigeo IS NULL; -- LORETO / MAYNAS / PUNCHANA
UPDATE public.distrito SET ubigeo = '160110' WHERE id_distrito = 1473 AND ubigeo IS NULL; -- LORETO / MAYNAS / TORRES CAUSANA
UPDATE public.distrito SET ubigeo = '160112' WHERE id_distrito = 1474 AND ubigeo IS NULL; -- LORETO / MAYNAS / BELEN
UPDATE public.distrito SET ubigeo = '160113' WHERE id_distrito = 1475 AND ubigeo IS NULL; -- LORETO / MAYNAS / SAN JUAN BAUTISTA
UPDATE public.distrito SET ubigeo = '160201' WHERE id_distrito = 1476 AND ubigeo IS NULL; -- LORETO / ALTO AMAZONAS / YURIMAGUAS
UPDATE public.distrito SET ubigeo = '160202' WHERE id_distrito = 1477 AND ubigeo IS NULL; -- LORETO / ALTO AMAZONAS / BALSAPUERTO
UPDATE public.distrito SET ubigeo = '160205' WHERE id_distrito = 1478 AND ubigeo IS NULL; -- LORETO / ALTO AMAZONAS / JEBEROS
UPDATE public.distrito SET ubigeo = '160206' WHERE id_distrito = 1479 AND ubigeo IS NULL; -- LORETO / ALTO AMAZONAS / LAGUNAS
UPDATE public.distrito SET ubigeo = '160210' WHERE id_distrito = 1480 AND ubigeo IS NULL; -- LORETO / ALTO AMAZONAS / SANTA CRUZ
UPDATE public.distrito SET ubigeo = '160211' WHERE id_distrito = 1481 AND ubigeo IS NULL; -- LORETO / ALTO AMAZONAS / TENIENTE CESAR LOPEZ ROJAS
UPDATE public.distrito SET ubigeo = '160301' WHERE id_distrito = 1482 AND ubigeo IS NULL; -- LORETO / LORETO / NAUTA
UPDATE public.distrito SET ubigeo = '160302' WHERE id_distrito = 1483 AND ubigeo IS NULL; -- LORETO / LORETO / PARINARI
UPDATE public.distrito SET ubigeo = '160303' WHERE id_distrito = 1484 AND ubigeo IS NULL; -- LORETO / LORETO / TIGRE
UPDATE public.distrito SET ubigeo = '160304' WHERE id_distrito = 1485 AND ubigeo IS NULL; -- LORETO / LORETO / TROMPETEROS
UPDATE public.distrito SET ubigeo = '160305' WHERE id_distrito = 1486 AND ubigeo IS NULL; -- LORETO / LORETO / URARINAS
UPDATE public.distrito SET ubigeo = '160401' WHERE id_distrito = 1487 AND ubigeo IS NULL; -- LORETO / MARISCAL RAMON CASTILLA / RAMON CASTILLA
UPDATE public.distrito SET ubigeo = '160402' WHERE id_distrito = 1488 AND ubigeo IS NULL; -- LORETO / MARISCAL RAMON CASTILLA / PEBAS
UPDATE public.distrito SET ubigeo = '160404' WHERE id_distrito = 1490 AND ubigeo IS NULL; -- LORETO / MARISCAL RAMON CASTILLA / SAN PABLO
UPDATE public.distrito SET ubigeo = '160501' WHERE id_distrito = 1491 AND ubigeo IS NULL; -- LORETO / REQUENA / REQUENA
UPDATE public.distrito SET ubigeo = '160502' WHERE id_distrito = 1492 AND ubigeo IS NULL; -- LORETO / REQUENA / ALTO TAPICHE
UPDATE public.distrito SET ubigeo = '160503' WHERE id_distrito = 1493 AND ubigeo IS NULL; -- LORETO / REQUENA / CAPELO
UPDATE public.distrito SET ubigeo = '160504' WHERE id_distrito = 1494 AND ubigeo IS NULL; -- LORETO / REQUENA / EMILIO SAN MARTIN
UPDATE public.distrito SET ubigeo = '160505' WHERE id_distrito = 1495 AND ubigeo IS NULL; -- LORETO / REQUENA / MAQUIA
UPDATE public.distrito SET ubigeo = '160506' WHERE id_distrito = 1496 AND ubigeo IS NULL; -- LORETO / REQUENA / PUINAHUA
UPDATE public.distrito SET ubigeo = '160507' WHERE id_distrito = 1497 AND ubigeo IS NULL; -- LORETO / REQUENA / SAQUENA
UPDATE public.distrito SET ubigeo = '160508' WHERE id_distrito = 1498 AND ubigeo IS NULL; -- LORETO / REQUENA / SOPLIN
UPDATE public.distrito SET ubigeo = '160509' WHERE id_distrito = 1499 AND ubigeo IS NULL; -- LORETO / REQUENA / TAPICHE
UPDATE public.distrito SET ubigeo = '160510' WHERE id_distrito = 1500 AND ubigeo IS NULL; -- LORETO / REQUENA / JENARO HERRERA
UPDATE public.distrito SET ubigeo = '160511' WHERE id_distrito = 1501 AND ubigeo IS NULL; -- LORETO / REQUENA / YAQUERANA
UPDATE public.distrito SET ubigeo = '160601' WHERE id_distrito = 1502 AND ubigeo IS NULL; -- LORETO / UCAYALI / CONTAMANA
UPDATE public.distrito SET ubigeo = '160602' WHERE id_distrito = 1503 AND ubigeo IS NULL; -- LORETO / UCAYALI / INAHUAYA
UPDATE public.distrito SET ubigeo = '160603' WHERE id_distrito = 1504 AND ubigeo IS NULL; -- LORETO / UCAYALI / PADRE MARQUEZ
UPDATE public.distrito SET ubigeo = '160604' WHERE id_distrito = 1505 AND ubigeo IS NULL; -- LORETO / UCAYALI / PAMPA HERMOSA
UPDATE public.distrito SET ubigeo = '160605' WHERE id_distrito = 1506 AND ubigeo IS NULL; -- LORETO / UCAYALI / SARAYACU
UPDATE public.distrito SET ubigeo = '160606' WHERE id_distrito = 1507 AND ubigeo IS NULL; -- LORETO / UCAYALI / VARGAS GUERRA
UPDATE public.distrito SET ubigeo = '170101' WHERE id_distrito = 1518 AND ubigeo IS NULL; -- MADRE DE DIOS / TAMBOPATA / TAMBOPATA
UPDATE public.distrito SET ubigeo = '170102' WHERE id_distrito = 1519 AND ubigeo IS NULL; -- MADRE DE DIOS / TAMBOPATA / INAMBARI
UPDATE public.distrito SET ubigeo = '170103' WHERE id_distrito = 1520 AND ubigeo IS NULL; -- MADRE DE DIOS / TAMBOPATA / LAS PIEDRAS
UPDATE public.distrito SET ubigeo = '170104' WHERE id_distrito = 1521 AND ubigeo IS NULL; -- MADRE DE DIOS / TAMBOPATA / LABERINTO
UPDATE public.distrito SET ubigeo = '170201' WHERE id_distrito = 1522 AND ubigeo IS NULL; -- MADRE DE DIOS / MANU / MANU
UPDATE public.distrito SET ubigeo = '170202' WHERE id_distrito = 1523 AND ubigeo IS NULL; -- MADRE DE DIOS / MANU / FITZCARRALD
UPDATE public.distrito SET ubigeo = '170203' WHERE id_distrito = 1524 AND ubigeo IS NULL; -- MADRE DE DIOS / MANU / MADRE DE DIOS
UPDATE public.distrito SET ubigeo = '170204' WHERE id_distrito = 1525 AND ubigeo IS NULL; -- MADRE DE DIOS / MANU / HUEPETUHE
UPDATE public.distrito SET ubigeo = '170302' WHERE id_distrito = 1527 AND ubigeo IS NULL; -- MADRE DE DIOS / TAHUAMANU / IBERIA
UPDATE public.distrito SET ubigeo = '170303' WHERE id_distrito = 1528 AND ubigeo IS NULL; -- MADRE DE DIOS / TAHUAMANU / TAHUAMANU
UPDATE public.distrito SET ubigeo = '180101' WHERE id_distrito = 1529 AND ubigeo IS NULL; -- MOQUEGUA / MARISCAL NIETO / MOQUEGUA
UPDATE public.distrito SET ubigeo = '180102' WHERE id_distrito = 1530 AND ubigeo IS NULL; -- MOQUEGUA / MARISCAL NIETO / CARUMAS
UPDATE public.distrito SET ubigeo = '180103' WHERE id_distrito = 1531 AND ubigeo IS NULL; -- MOQUEGUA / MARISCAL NIETO / CUCHUMBAYA
UPDATE public.distrito SET ubigeo = '180104' WHERE id_distrito = 1532 AND ubigeo IS NULL; -- MOQUEGUA / MARISCAL NIETO / SAMEGUA
UPDATE public.distrito SET ubigeo = '180105' WHERE id_distrito = 1533 AND ubigeo IS NULL; -- MOQUEGUA / MARISCAL NIETO / SAN CRISTOBAL
UPDATE public.distrito SET ubigeo = '180106' WHERE id_distrito = 1534 AND ubigeo IS NULL; -- MOQUEGUA / MARISCAL NIETO / TORATA
UPDATE public.distrito SET ubigeo = '180201' WHERE id_distrito = 1536 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / OMATE
UPDATE public.distrito SET ubigeo = '180202' WHERE id_distrito = 1537 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / CHOJATA
UPDATE public.distrito SET ubigeo = '180203' WHERE id_distrito = 1538 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / COALAQUE
UPDATE public.distrito SET ubigeo = '180205' WHERE id_distrito = 1540 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / LA CAPILLA
UPDATE public.distrito SET ubigeo = '180206' WHERE id_distrito = 1541 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / LLOQUE
UPDATE public.distrito SET ubigeo = '180207' WHERE id_distrito = 1542 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / MATALAQUE
UPDATE public.distrito SET ubigeo = '180208' WHERE id_distrito = 1543 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / PUQUINA
UPDATE public.distrito SET ubigeo = '180209' WHERE id_distrito = 1544 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / QUINISTAQUILLAS
UPDATE public.distrito SET ubigeo = '180210' WHERE id_distrito = 1545 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / UBINAS
UPDATE public.distrito SET ubigeo = '180211' WHERE id_distrito = 1546 AND ubigeo IS NULL; -- MOQUEGUA / GENERAL SANCHEZ CERRO / YUNGA
UPDATE public.distrito SET ubigeo = '180301' WHERE id_distrito = 1547 AND ubigeo IS NULL; -- MOQUEGUA / ILO / ILO
UPDATE public.distrito SET ubigeo = '180302' WHERE id_distrito = 1548 AND ubigeo IS NULL; -- MOQUEGUA / ILO / EL ALGARROBAL
UPDATE public.distrito SET ubigeo = '180303' WHERE id_distrito = 1549 AND ubigeo IS NULL; -- MOQUEGUA / ILO / PACOCHA
UPDATE public.distrito SET ubigeo = '190101' WHERE id_distrito = 1550 AND ubigeo IS NULL; -- PASCO / PASCO / CHAUPIMARCA
UPDATE public.distrito SET ubigeo = '190102' WHERE id_distrito = 1551 AND ubigeo IS NULL; -- PASCO / PASCO / HUACHON
UPDATE public.distrito SET ubigeo = '190103' WHERE id_distrito = 1552 AND ubigeo IS NULL; -- PASCO / PASCO / HUARIACA
UPDATE public.distrito SET ubigeo = '190104' WHERE id_distrito = 1553 AND ubigeo IS NULL; -- PASCO / PASCO / HUAYLLAY
UPDATE public.distrito SET ubigeo = '190105' WHERE id_distrito = 1554 AND ubigeo IS NULL; -- PASCO / PASCO / NINACACA
UPDATE public.distrito SET ubigeo = '190106' WHERE id_distrito = 1555 AND ubigeo IS NULL; -- PASCO / PASCO / PALLANCHACRA
UPDATE public.distrito SET ubigeo = '190107' WHERE id_distrito = 1556 AND ubigeo IS NULL; -- PASCO / PASCO / PAUCARTAMBO
UPDATE public.distrito SET ubigeo = '190108' WHERE id_distrito = 1557 AND ubigeo IS NULL; -- PASCO / PASCO / SAN FRANCISCO DE ASIS DE YARUSYACAN
UPDATE public.distrito SET ubigeo = '190109' WHERE id_distrito = 1558 AND ubigeo IS NULL; -- PASCO / PASCO / SIMON BOLIVAR
UPDATE public.distrito SET ubigeo = '190110' WHERE id_distrito = 1559 AND ubigeo IS NULL; -- PASCO / PASCO / TICLACAYAN
UPDATE public.distrito SET ubigeo = '190111' WHERE id_distrito = 1560 AND ubigeo IS NULL; -- PASCO / PASCO / TINYAHUARCO
UPDATE public.distrito SET ubigeo = '190112' WHERE id_distrito = 1561 AND ubigeo IS NULL; -- PASCO / PASCO / VICCO
UPDATE public.distrito SET ubigeo = '190113' WHERE id_distrito = 1562 AND ubigeo IS NULL; -- PASCO / PASCO / YANACANCHA
UPDATE public.distrito SET ubigeo = '190201' WHERE id_distrito = 1563 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / YANAHUANCA
UPDATE public.distrito SET ubigeo = '190202' WHERE id_distrito = 1564 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / CHACAYAN
UPDATE public.distrito SET ubigeo = '190203' WHERE id_distrito = 1565 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / GOYLLARISQUIZGA
UPDATE public.distrito SET ubigeo = '190204' WHERE id_distrito = 1566 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / PAUCAR
UPDATE public.distrito SET ubigeo = '190205' WHERE id_distrito = 1567 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / SAN PEDRO DE PILLAO
UPDATE public.distrito SET ubigeo = '190206' WHERE id_distrito = 1568 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / SANTA ANA DE TUSI
UPDATE public.distrito SET ubigeo = '190207' WHERE id_distrito = 1569 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / TAPUC
UPDATE public.distrito SET ubigeo = '190208' WHERE id_distrito = 1570 AND ubigeo IS NULL; -- PASCO / DANIEL ALCIDES CARRION / VILCABAMBA
UPDATE public.distrito SET ubigeo = '190301' WHERE id_distrito = 1571 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / OXAPAMPA
UPDATE public.distrito SET ubigeo = '190302' WHERE id_distrito = 1572 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / CHONTABAMBA
UPDATE public.distrito SET ubigeo = '190303' WHERE id_distrito = 1573 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / HUANCABAMBA
UPDATE public.distrito SET ubigeo = '190304' WHERE id_distrito = 1574 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / PALCAZU
UPDATE public.distrito SET ubigeo = '190305' WHERE id_distrito = 1575 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / POZUZO
UPDATE public.distrito SET ubigeo = '190306' WHERE id_distrito = 1576 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / PUERTO BERMUDEZ
UPDATE public.distrito SET ubigeo = '190307' WHERE id_distrito = 1577 AND ubigeo IS NULL; -- PASCO / OXAPAMPA / VILLA RICA
UPDATE public.distrito SET ubigeo = '200101' WHERE id_distrito = 1579 AND ubigeo IS NULL; -- PIURA / PIURA / PIURA
UPDATE public.distrito SET ubigeo = '200104' WHERE id_distrito = 1580 AND ubigeo IS NULL; -- PIURA / PIURA / CASTILLA
UPDATE public.distrito SET ubigeo = '200105' WHERE id_distrito = 1581 AND ubigeo IS NULL; -- PIURA / PIURA / CATACAOS
UPDATE public.distrito SET ubigeo = '200107' WHERE id_distrito = 1582 AND ubigeo IS NULL; -- PIURA / PIURA / CURA MORI
UPDATE public.distrito SET ubigeo = '200108' WHERE id_distrito = 1583 AND ubigeo IS NULL; -- PIURA / PIURA / EL TALLAN
UPDATE public.distrito SET ubigeo = '200109' WHERE id_distrito = 1584 AND ubigeo IS NULL; -- PIURA / PIURA / LA ARENA
UPDATE public.distrito SET ubigeo = '200110' WHERE id_distrito = 1585 AND ubigeo IS NULL; -- PIURA / PIURA / LA UNION
UPDATE public.distrito SET ubigeo = '200111' WHERE id_distrito = 1586 AND ubigeo IS NULL; -- PIURA / PIURA / LAS LOMAS
UPDATE public.distrito SET ubigeo = '200114' WHERE id_distrito = 1587 AND ubigeo IS NULL; -- PIURA / PIURA / TAMBO GRANDE
UPDATE public.distrito SET ubigeo = '200201' WHERE id_distrito = 1589 AND ubigeo IS NULL; -- PIURA / AYABACA / AYABACA
UPDATE public.distrito SET ubigeo = '200202' WHERE id_distrito = 1590 AND ubigeo IS NULL; -- PIURA / AYABACA / FRIAS
UPDATE public.distrito SET ubigeo = '200203' WHERE id_distrito = 1591 AND ubigeo IS NULL; -- PIURA / AYABACA / JILILI
UPDATE public.distrito SET ubigeo = '200204' WHERE id_distrito = 1592 AND ubigeo IS NULL; -- PIURA / AYABACA / LAGUNAS
UPDATE public.distrito SET ubigeo = '200205' WHERE id_distrito = 1593 AND ubigeo IS NULL; -- PIURA / AYABACA / MONTERO
UPDATE public.distrito SET ubigeo = '200206' WHERE id_distrito = 1594 AND ubigeo IS NULL; -- PIURA / AYABACA / PACAIPAMPA
UPDATE public.distrito SET ubigeo = '200207' WHERE id_distrito = 1595 AND ubigeo IS NULL; -- PIURA / AYABACA / PAIMAS
UPDATE public.distrito SET ubigeo = '200208' WHERE id_distrito = 1596 AND ubigeo IS NULL; -- PIURA / AYABACA / SAPILLICA
UPDATE public.distrito SET ubigeo = '200209' WHERE id_distrito = 1597 AND ubigeo IS NULL; -- PIURA / AYABACA / SICCHEZ
UPDATE public.distrito SET ubigeo = '200210' WHERE id_distrito = 1598 AND ubigeo IS NULL; -- PIURA / AYABACA / SUYO
UPDATE public.distrito SET ubigeo = '200301' WHERE id_distrito = 1599 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / HUANCABAMBA
UPDATE public.distrito SET ubigeo = '200302' WHERE id_distrito = 1600 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / CANCHAQUE
UPDATE public.distrito SET ubigeo = '200303' WHERE id_distrito = 1601 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / EL CARMEN DE LA FRONTERA
UPDATE public.distrito SET ubigeo = '200304' WHERE id_distrito = 1602 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / HUARMACA
UPDATE public.distrito SET ubigeo = '200305' WHERE id_distrito = 1603 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / LALAQUIZ
UPDATE public.distrito SET ubigeo = '200306' WHERE id_distrito = 1604 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / SAN MIGUEL DE EL FAIQUE
UPDATE public.distrito SET ubigeo = '200307' WHERE id_distrito = 1605 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / SONDOR
UPDATE public.distrito SET ubigeo = '200308' WHERE id_distrito = 1606 AND ubigeo IS NULL; -- PIURA / HUANCABAMBA / SONDORILLO
UPDATE public.distrito SET ubigeo = '200401' WHERE id_distrito = 1607 AND ubigeo IS NULL; -- PIURA / MORROPON / CHULUCANAS
UPDATE public.distrito SET ubigeo = '200402' WHERE id_distrito = 1608 AND ubigeo IS NULL; -- PIURA / MORROPON / BUENOS AIRES
UPDATE public.distrito SET ubigeo = '200403' WHERE id_distrito = 1609 AND ubigeo IS NULL; -- PIURA / MORROPON / CHALACO
UPDATE public.distrito SET ubigeo = '200404' WHERE id_distrito = 1610 AND ubigeo IS NULL; -- PIURA / MORROPON / LA MATANZA
UPDATE public.distrito SET ubigeo = '200405' WHERE id_distrito = 1611 AND ubigeo IS NULL; -- PIURA / MORROPON / MORROPON
UPDATE public.distrito SET ubigeo = '200406' WHERE id_distrito = 1612 AND ubigeo IS NULL; -- PIURA / MORROPON / SALITRAL
UPDATE public.distrito SET ubigeo = '200407' WHERE id_distrito = 1613 AND ubigeo IS NULL; -- PIURA / MORROPON / SAN JUAN DE BIGOTE
UPDATE public.distrito SET ubigeo = '200408' WHERE id_distrito = 1614 AND ubigeo IS NULL; -- PIURA / MORROPON / SANTA CATALINA DE MOSSA
UPDATE public.distrito SET ubigeo = '200409' WHERE id_distrito = 1615 AND ubigeo IS NULL; -- PIURA / MORROPON / SANTO DOMINGO
UPDATE public.distrito SET ubigeo = '200410' WHERE id_distrito = 1616 AND ubigeo IS NULL; -- PIURA / MORROPON / YAMANGO
UPDATE public.distrito SET ubigeo = '200501' WHERE id_distrito = 1617 AND ubigeo IS NULL; -- PIURA / PAITA / PAITA
UPDATE public.distrito SET ubigeo = '200502' WHERE id_distrito = 1618 AND ubigeo IS NULL; -- PIURA / PAITA / AMOTAPE
UPDATE public.distrito SET ubigeo = '200503' WHERE id_distrito = 1619 AND ubigeo IS NULL; -- PIURA / PAITA / ARENAL
UPDATE public.distrito SET ubigeo = '200504' WHERE id_distrito = 1620 AND ubigeo IS NULL; -- PIURA / PAITA / COLAN
UPDATE public.distrito SET ubigeo = '200505' WHERE id_distrito = 1621 AND ubigeo IS NULL; -- PIURA / PAITA / LA HUACA
UPDATE public.distrito SET ubigeo = '200506' WHERE id_distrito = 1622 AND ubigeo IS NULL; -- PIURA / PAITA / TAMARINDO
UPDATE public.distrito SET ubigeo = '200507' WHERE id_distrito = 1623 AND ubigeo IS NULL; -- PIURA / PAITA / VICHAYAL
UPDATE public.distrito SET ubigeo = '200601' WHERE id_distrito = 1624 AND ubigeo IS NULL; -- PIURA / SULLANA / SULLANA
UPDATE public.distrito SET ubigeo = '200602' WHERE id_distrito = 1625 AND ubigeo IS NULL; -- PIURA / SULLANA / BELLAVISTA
UPDATE public.distrito SET ubigeo = '200603' WHERE id_distrito = 1626 AND ubigeo IS NULL; -- PIURA / SULLANA / IGNACIO ESCUDERO
UPDATE public.distrito SET ubigeo = '200604' WHERE id_distrito = 1627 AND ubigeo IS NULL; -- PIURA / SULLANA / LANCONES
UPDATE public.distrito SET ubigeo = '200605' WHERE id_distrito = 1628 AND ubigeo IS NULL; -- PIURA / SULLANA / MARCAVELICA
UPDATE public.distrito SET ubigeo = '200606' WHERE id_distrito = 1629 AND ubigeo IS NULL; -- PIURA / SULLANA / MIGUEL CHECA
UPDATE public.distrito SET ubigeo = '200607' WHERE id_distrito = 1630 AND ubigeo IS NULL; -- PIURA / SULLANA / QUERECOTILLO
UPDATE public.distrito SET ubigeo = '200608' WHERE id_distrito = 1631 AND ubigeo IS NULL; -- PIURA / SULLANA / SALITRAL
UPDATE public.distrito SET ubigeo = '200702' WHERE id_distrito = 1633 AND ubigeo IS NULL; -- PIURA / TALARA / EL ALTO
UPDATE public.distrito SET ubigeo = '200703' WHERE id_distrito = 1634 AND ubigeo IS NULL; -- PIURA / TALARA / LA BREA
UPDATE public.distrito SET ubigeo = '200704' WHERE id_distrito = 1635 AND ubigeo IS NULL; -- PIURA / TALARA / LOBITOS
UPDATE public.distrito SET ubigeo = '200705' WHERE id_distrito = 1636 AND ubigeo IS NULL; -- PIURA / TALARA / LOS ORGANOS
UPDATE public.distrito SET ubigeo = '200706' WHERE id_distrito = 1637 AND ubigeo IS NULL; -- PIURA / TALARA / MANCORA
UPDATE public.distrito SET ubigeo = '200801' WHERE id_distrito = 1638 AND ubigeo IS NULL; -- PIURA / SECHURA / SECHURA
UPDATE public.distrito SET ubigeo = '200802' WHERE id_distrito = 1639 AND ubigeo IS NULL; -- PIURA / SECHURA / BELLAVISTA DE LA UNION
UPDATE public.distrito SET ubigeo = '200803' WHERE id_distrito = 1640 AND ubigeo IS NULL; -- PIURA / SECHURA / BERNAL
UPDATE public.distrito SET ubigeo = '200804' WHERE id_distrito = 1641 AND ubigeo IS NULL; -- PIURA / SECHURA / CRISTO NOS VALGA
UPDATE public.distrito SET ubigeo = '200805' WHERE id_distrito = 1642 AND ubigeo IS NULL; -- PIURA / SECHURA / VICE
UPDATE public.distrito SET ubigeo = '200806' WHERE id_distrito = 1643 AND ubigeo IS NULL; -- PIURA / SECHURA / RINCONADA LLICUAR
UPDATE public.distrito SET ubigeo = '210101' WHERE id_distrito = 1644 AND ubigeo IS NULL; -- PUNO / PUNO / PUNO
UPDATE public.distrito SET ubigeo = '210102' WHERE id_distrito = 1645 AND ubigeo IS NULL; -- PUNO / PUNO / ACORA
UPDATE public.distrito SET ubigeo = '210103' WHERE id_distrito = 1646 AND ubigeo IS NULL; -- PUNO / PUNO / AMANTANI
UPDATE public.distrito SET ubigeo = '210104' WHERE id_distrito = 1647 AND ubigeo IS NULL; -- PUNO / PUNO / ATUNCOLLA
UPDATE public.distrito SET ubigeo = '210105' WHERE id_distrito = 1648 AND ubigeo IS NULL; -- PUNO / PUNO / CAPACHICA
UPDATE public.distrito SET ubigeo = '210106' WHERE id_distrito = 1649 AND ubigeo IS NULL; -- PUNO / PUNO / CHUCUITO
UPDATE public.distrito SET ubigeo = '210107' WHERE id_distrito = 1650 AND ubigeo IS NULL; -- PUNO / PUNO / COATA
UPDATE public.distrito SET ubigeo = '210108' WHERE id_distrito = 1651 AND ubigeo IS NULL; -- PUNO / PUNO / HUATA
UPDATE public.distrito SET ubigeo = '210110' WHERE id_distrito = 1653 AND ubigeo IS NULL; -- PUNO / PUNO / PAUCARCOLLA
UPDATE public.distrito SET ubigeo = '210111' WHERE id_distrito = 1654 AND ubigeo IS NULL; -- PUNO / PUNO / PICHACANI
UPDATE public.distrito SET ubigeo = '210112' WHERE id_distrito = 1655 AND ubigeo IS NULL; -- PUNO / PUNO / PLATERIA
UPDATE public.distrito SET ubigeo = '210114' WHERE id_distrito = 1657 AND ubigeo IS NULL; -- PUNO / PUNO / TIQUILLACA
UPDATE public.distrito SET ubigeo = '210115' WHERE id_distrito = 1658 AND ubigeo IS NULL; -- PUNO / PUNO / VILQUE
UPDATE public.distrito SET ubigeo = '210201' WHERE id_distrito = 1659 AND ubigeo IS NULL; -- PUNO / AZANGARO / AZANGARO
UPDATE public.distrito SET ubigeo = '210202' WHERE id_distrito = 1660 AND ubigeo IS NULL; -- PUNO / AZANGARO / ACHAYA
UPDATE public.distrito SET ubigeo = '210203' WHERE id_distrito = 1661 AND ubigeo IS NULL; -- PUNO / AZANGARO / ARAPA
UPDATE public.distrito SET ubigeo = '210204' WHERE id_distrito = 1662 AND ubigeo IS NULL; -- PUNO / AZANGARO / ASILLO
UPDATE public.distrito SET ubigeo = '210205' WHERE id_distrito = 1663 AND ubigeo IS NULL; -- PUNO / AZANGARO / CAMINACA
UPDATE public.distrito SET ubigeo = '210206' WHERE id_distrito = 1664 AND ubigeo IS NULL; -- PUNO / AZANGARO / CHUPA
UPDATE public.distrito SET ubigeo = '210207' WHERE id_distrito = 1665 AND ubigeo IS NULL; -- PUNO / AZANGARO / JOSE DOMINGO CHOQUEHUANCA
UPDATE public.distrito SET ubigeo = '210209' WHERE id_distrito = 1667 AND ubigeo IS NULL; -- PUNO / AZANGARO / POTONI
UPDATE public.distrito SET ubigeo = '210210' WHERE id_distrito = 1668 AND ubigeo IS NULL; -- PUNO / AZANGARO / SAMAN
UPDATE public.distrito SET ubigeo = '210211' WHERE id_distrito = 1669 AND ubigeo IS NULL; -- PUNO / AZANGARO / SAN ANTON
UPDATE public.distrito SET ubigeo = '210212' WHERE id_distrito = 1670 AND ubigeo IS NULL; -- PUNO / AZANGARO / SAN JOSE
UPDATE public.distrito SET ubigeo = '210213' WHERE id_distrito = 1671 AND ubigeo IS NULL; -- PUNO / AZANGARO / SAN JUAN DE SALINAS
UPDATE public.distrito SET ubigeo = '210214' WHERE id_distrito = 1672 AND ubigeo IS NULL; -- PUNO / AZANGARO / SANTIAGO DE PUPUJA
UPDATE public.distrito SET ubigeo = '210215' WHERE id_distrito = 1673 AND ubigeo IS NULL; -- PUNO / AZANGARO / TIRAPATA
UPDATE public.distrito SET ubigeo = '210301' WHERE id_distrito = 1674 AND ubigeo IS NULL; -- PUNO / CARABAYA / MACUSANI
UPDATE public.distrito SET ubigeo = '210302' WHERE id_distrito = 1675 AND ubigeo IS NULL; -- PUNO / CARABAYA / AJOYANI
UPDATE public.distrito SET ubigeo = '210303' WHERE id_distrito = 1676 AND ubigeo IS NULL; -- PUNO / CARABAYA / AYAPATA
UPDATE public.distrito SET ubigeo = '210304' WHERE id_distrito = 1677 AND ubigeo IS NULL; -- PUNO / CARABAYA / COASA
UPDATE public.distrito SET ubigeo = '210305' WHERE id_distrito = 1678 AND ubigeo IS NULL; -- PUNO / CARABAYA / CORANI
UPDATE public.distrito SET ubigeo = '210306' WHERE id_distrito = 1679 AND ubigeo IS NULL; -- PUNO / CARABAYA / CRUCERO
UPDATE public.distrito SET ubigeo = '210308' WHERE id_distrito = 1681 AND ubigeo IS NULL; -- PUNO / CARABAYA / OLLACHEA
UPDATE public.distrito SET ubigeo = '210309' WHERE id_distrito = 1682 AND ubigeo IS NULL; -- PUNO / CARABAYA / SAN GABAN
UPDATE public.distrito SET ubigeo = '210310' WHERE id_distrito = 1683 AND ubigeo IS NULL; -- PUNO / CARABAYA / USICAYOS
UPDATE public.distrito SET ubigeo = '210401' WHERE id_distrito = 1684 AND ubigeo IS NULL; -- PUNO / CHUCUITO / JULI
UPDATE public.distrito SET ubigeo = '210402' WHERE id_distrito = 1685 AND ubigeo IS NULL; -- PUNO / CHUCUITO / DESAGUADERO
UPDATE public.distrito SET ubigeo = '210403' WHERE id_distrito = 1686 AND ubigeo IS NULL; -- PUNO / CHUCUITO / HUACULLANI
UPDATE public.distrito SET ubigeo = '210404' WHERE id_distrito = 1687 AND ubigeo IS NULL; -- PUNO / CHUCUITO / KELLUYO
UPDATE public.distrito SET ubigeo = '210405' WHERE id_distrito = 1688 AND ubigeo IS NULL; -- PUNO / CHUCUITO / PISACOMA
UPDATE public.distrito SET ubigeo = '210406' WHERE id_distrito = 1689 AND ubigeo IS NULL; -- PUNO / CHUCUITO / POMATA
UPDATE public.distrito SET ubigeo = '210407' WHERE id_distrito = 1690 AND ubigeo IS NULL; -- PUNO / CHUCUITO / ZEPITA
UPDATE public.distrito SET ubigeo = '210501' WHERE id_distrito = 1691 AND ubigeo IS NULL; -- PUNO / EL COLLAO / ILAVE
UPDATE public.distrito SET ubigeo = '210502' WHERE id_distrito = 1692 AND ubigeo IS NULL; -- PUNO / EL COLLAO / CAPAZO
UPDATE public.distrito SET ubigeo = '210503' WHERE id_distrito = 1693 AND ubigeo IS NULL; -- PUNO / EL COLLAO / PILCUYO
UPDATE public.distrito SET ubigeo = '210504' WHERE id_distrito = 1694 AND ubigeo IS NULL; -- PUNO / EL COLLAO / SANTA ROSA
UPDATE public.distrito SET ubigeo = '210505' WHERE id_distrito = 1695 AND ubigeo IS NULL; -- PUNO / EL COLLAO / CONDURIRI
UPDATE public.distrito SET ubigeo = '210601' WHERE id_distrito = 1696 AND ubigeo IS NULL; -- PUNO / HUANCANE / HUANCANE
UPDATE public.distrito SET ubigeo = '210602' WHERE id_distrito = 1697 AND ubigeo IS NULL; -- PUNO / HUANCANE / COJATA
UPDATE public.distrito SET ubigeo = '210603' WHERE id_distrito = 1698 AND ubigeo IS NULL; -- PUNO / HUANCANE / HUATASANI
UPDATE public.distrito SET ubigeo = '210604' WHERE id_distrito = 1699 AND ubigeo IS NULL; -- PUNO / HUANCANE / INCHUPALLA
UPDATE public.distrito SET ubigeo = '210605' WHERE id_distrito = 1700 AND ubigeo IS NULL; -- PUNO / HUANCANE / PUSI
UPDATE public.distrito SET ubigeo = '210606' WHERE id_distrito = 1701 AND ubigeo IS NULL; -- PUNO / HUANCANE / ROSASPATA
UPDATE public.distrito SET ubigeo = '210607' WHERE id_distrito = 1702 AND ubigeo IS NULL; -- PUNO / HUANCANE / TARACO
UPDATE public.distrito SET ubigeo = '210608' WHERE id_distrito = 1703 AND ubigeo IS NULL; -- PUNO / HUANCANE / VILQUE CHICO
UPDATE public.distrito SET ubigeo = '210701' WHERE id_distrito = 1704 AND ubigeo IS NULL; -- PUNO / LAMPA / LAMPA
UPDATE public.distrito SET ubigeo = '210702' WHERE id_distrito = 1705 AND ubigeo IS NULL; -- PUNO / LAMPA / CABANILLA
UPDATE public.distrito SET ubigeo = '210703' WHERE id_distrito = 1706 AND ubigeo IS NULL; -- PUNO / LAMPA / CALAPUJA
UPDATE public.distrito SET ubigeo = '210704' WHERE id_distrito = 1707 AND ubigeo IS NULL; -- PUNO / LAMPA / NICASIO
UPDATE public.distrito SET ubigeo = '210705' WHERE id_distrito = 1708 AND ubigeo IS NULL; -- PUNO / LAMPA / OCUVIRI
UPDATE public.distrito SET ubigeo = '210706' WHERE id_distrito = 1709 AND ubigeo IS NULL; -- PUNO / LAMPA / PALCA
UPDATE public.distrito SET ubigeo = '210707' WHERE id_distrito = 1710 AND ubigeo IS NULL; -- PUNO / LAMPA / PARATIA
UPDATE public.distrito SET ubigeo = '210708' WHERE id_distrito = 1711 AND ubigeo IS NULL; -- PUNO / LAMPA / PUCARA
UPDATE public.distrito SET ubigeo = '210709' WHERE id_distrito = 1712 AND ubigeo IS NULL; -- PUNO / LAMPA / SANTA LUCIA
UPDATE public.distrito SET ubigeo = '210710' WHERE id_distrito = 1713 AND ubigeo IS NULL; -- PUNO / LAMPA / VILAVILA
UPDATE public.distrito SET ubigeo = '210801' WHERE id_distrito = 1714 AND ubigeo IS NULL; -- PUNO / MELGAR / AYAVIRI
UPDATE public.distrito SET ubigeo = '210802' WHERE id_distrito = 1715 AND ubigeo IS NULL; -- PUNO / MELGAR / ANTAUTA
UPDATE public.distrito SET ubigeo = '210803' WHERE id_distrito = 1716 AND ubigeo IS NULL; -- PUNO / MELGAR / CUPI
UPDATE public.distrito SET ubigeo = '210804' WHERE id_distrito = 1717 AND ubigeo IS NULL; -- PUNO / MELGAR / LLALLI
UPDATE public.distrito SET ubigeo = '210805' WHERE id_distrito = 1718 AND ubigeo IS NULL; -- PUNO / MELGAR / MACARI
UPDATE public.distrito SET ubigeo = '210807' WHERE id_distrito = 1720 AND ubigeo IS NULL; -- PUNO / MELGAR / ORURILLO
UPDATE public.distrito SET ubigeo = '210808' WHERE id_distrito = 1721 AND ubigeo IS NULL; -- PUNO / MELGAR / SANTA ROSA
UPDATE public.distrito SET ubigeo = '210809' WHERE id_distrito = 1722 AND ubigeo IS NULL; -- PUNO / MELGAR / UMACHIRI
UPDATE public.distrito SET ubigeo = '210901' WHERE id_distrito = 1723 AND ubigeo IS NULL; -- PUNO / MOHO / MOHO
UPDATE public.distrito SET ubigeo = '210902' WHERE id_distrito = 1724 AND ubigeo IS NULL; -- PUNO / MOHO / CONIMA
UPDATE public.distrito SET ubigeo = '210903' WHERE id_distrito = 1725 AND ubigeo IS NULL; -- PUNO / MOHO / HUAYRAPATA
UPDATE public.distrito SET ubigeo = '210904' WHERE id_distrito = 1726 AND ubigeo IS NULL; -- PUNO / MOHO / TILALI
UPDATE public.distrito SET ubigeo = '211001' WHERE id_distrito = 1727 AND ubigeo IS NULL; -- PUNO / SAN ANTONIO DE PUTINA / PUTINA
UPDATE public.distrito SET ubigeo = '211002' WHERE id_distrito = 1728 AND ubigeo IS NULL; -- PUNO / SAN ANTONIO DE PUTINA / ANANEA
UPDATE public.distrito SET ubigeo = '211003' WHERE id_distrito = 1729 AND ubigeo IS NULL; -- PUNO / SAN ANTONIO DE PUTINA / PEDRO VILCA APAZA
UPDATE public.distrito SET ubigeo = '211004' WHERE id_distrito = 1730 AND ubigeo IS NULL; -- PUNO / SAN ANTONIO DE PUTINA / QUILCAPUNCU
UPDATE public.distrito SET ubigeo = '211005' WHERE id_distrito = 1731 AND ubigeo IS NULL; -- PUNO / SAN ANTONIO DE PUTINA / SINA
UPDATE public.distrito SET ubigeo = '211101' WHERE id_distrito = 1732 AND ubigeo IS NULL; -- PUNO / SAN ROMAN / JULIACA
UPDATE public.distrito SET ubigeo = '211102' WHERE id_distrito = 1733 AND ubigeo IS NULL; -- PUNO / SAN ROMAN / CABANA
UPDATE public.distrito SET ubigeo = '211103' WHERE id_distrito = 1734 AND ubigeo IS NULL; -- PUNO / SAN ROMAN / CABANILLAS
UPDATE public.distrito SET ubigeo = '211104' WHERE id_distrito = 1735 AND ubigeo IS NULL; -- PUNO / SAN ROMAN / CARACOTO
UPDATE public.distrito SET ubigeo = '211201' WHERE id_distrito = 1737 AND ubigeo IS NULL; -- PUNO / SANDIA / SANDIA
UPDATE public.distrito SET ubigeo = '211202' WHERE id_distrito = 1738 AND ubigeo IS NULL; -- PUNO / SANDIA / CUYOCUYO
UPDATE public.distrito SET ubigeo = '211203' WHERE id_distrito = 1739 AND ubigeo IS NULL; -- PUNO / SANDIA / LIMBANI
UPDATE public.distrito SET ubigeo = '211204' WHERE id_distrito = 1740 AND ubigeo IS NULL; -- PUNO / SANDIA / PATAMBUCO
UPDATE public.distrito SET ubigeo = '211205' WHERE id_distrito = 1741 AND ubigeo IS NULL; -- PUNO / SANDIA / PHARA
UPDATE public.distrito SET ubigeo = '211206' WHERE id_distrito = 1742 AND ubigeo IS NULL; -- PUNO / SANDIA / QUIACA
UPDATE public.distrito SET ubigeo = '211207' WHERE id_distrito = 1743 AND ubigeo IS NULL; -- PUNO / SANDIA / SAN JUAN DEL ORO
UPDATE public.distrito SET ubigeo = '211208' WHERE id_distrito = 1744 AND ubigeo IS NULL; -- PUNO / SANDIA / YANAHUAYA
UPDATE public.distrito SET ubigeo = '211209' WHERE id_distrito = 1745 AND ubigeo IS NULL; -- PUNO / SANDIA / ALTO INAMBARI
UPDATE public.distrito SET ubigeo = '211210' WHERE id_distrito = 1746 AND ubigeo IS NULL; -- PUNO / SANDIA / SAN PEDRO DE PUTINA PUNCO
UPDATE public.distrito SET ubigeo = '211301' WHERE id_distrito = 1747 AND ubigeo IS NULL; -- PUNO / YUNGUYO / YUNGUYO
UPDATE public.distrito SET ubigeo = '211302' WHERE id_distrito = 1748 AND ubigeo IS NULL; -- PUNO / YUNGUYO / ANAPIA
UPDATE public.distrito SET ubigeo = '211303' WHERE id_distrito = 1749 AND ubigeo IS NULL; -- PUNO / YUNGUYO / COPANI
UPDATE public.distrito SET ubigeo = '211304' WHERE id_distrito = 1750 AND ubigeo IS NULL; -- PUNO / YUNGUYO / CUTURAPI
UPDATE public.distrito SET ubigeo = '211305' WHERE id_distrito = 1751 AND ubigeo IS NULL; -- PUNO / YUNGUYO / OLLARAYA
UPDATE public.distrito SET ubigeo = '211306' WHERE id_distrito = 1752 AND ubigeo IS NULL; -- PUNO / YUNGUYO / TINICACHI
UPDATE public.distrito SET ubigeo = '211307' WHERE id_distrito = 1753 AND ubigeo IS NULL; -- PUNO / YUNGUYO / UNICACHI
UPDATE public.distrito SET ubigeo = '220101' WHERE id_distrito = 1754 AND ubigeo IS NULL; -- SAN MARTIN / MOYOBAMBA / MOYOBAMBA
UPDATE public.distrito SET ubigeo = '220102' WHERE id_distrito = 1755 AND ubigeo IS NULL; -- SAN MARTIN / MOYOBAMBA / CALZADA
UPDATE public.distrito SET ubigeo = '220103' WHERE id_distrito = 1756 AND ubigeo IS NULL; -- SAN MARTIN / MOYOBAMBA / HABANA
UPDATE public.distrito SET ubigeo = '220104' WHERE id_distrito = 1757 AND ubigeo IS NULL; -- SAN MARTIN / MOYOBAMBA / JEPELACIO
UPDATE public.distrito SET ubigeo = '220105' WHERE id_distrito = 1758 AND ubigeo IS NULL; -- SAN MARTIN / MOYOBAMBA / SORITOR
UPDATE public.distrito SET ubigeo = '220106' WHERE id_distrito = 1759 AND ubigeo IS NULL; -- SAN MARTIN / MOYOBAMBA / YANTALO
UPDATE public.distrito SET ubigeo = '220201' WHERE id_distrito = 1760 AND ubigeo IS NULL; -- SAN MARTIN / BELLAVISTA / BELLAVISTA
UPDATE public.distrito SET ubigeo = '220202' WHERE id_distrito = 1761 AND ubigeo IS NULL; -- SAN MARTIN / BELLAVISTA / ALTO BIAVO
UPDATE public.distrito SET ubigeo = '220203' WHERE id_distrito = 1762 AND ubigeo IS NULL; -- SAN MARTIN / BELLAVISTA / BAJO BIAVO
UPDATE public.distrito SET ubigeo = '220204' WHERE id_distrito = 1763 AND ubigeo IS NULL; -- SAN MARTIN / BELLAVISTA / HUALLAGA
UPDATE public.distrito SET ubigeo = '220205' WHERE id_distrito = 1764 AND ubigeo IS NULL; -- SAN MARTIN / BELLAVISTA / SAN PABLO
UPDATE public.distrito SET ubigeo = '220206' WHERE id_distrito = 1765 AND ubigeo IS NULL; -- SAN MARTIN / BELLAVISTA / SAN RAFAEL
UPDATE public.distrito SET ubigeo = '220301' WHERE id_distrito = 1766 AND ubigeo IS NULL; -- SAN MARTIN / EL DORADO / SAN JOSE DE SISA
UPDATE public.distrito SET ubigeo = '220302' WHERE id_distrito = 1767 AND ubigeo IS NULL; -- SAN MARTIN / EL DORADO / AGUA BLANCA
UPDATE public.distrito SET ubigeo = '220303' WHERE id_distrito = 1768 AND ubigeo IS NULL; -- SAN MARTIN / EL DORADO / SAN MARTIN
UPDATE public.distrito SET ubigeo = '220304' WHERE id_distrito = 1769 AND ubigeo IS NULL; -- SAN MARTIN / EL DORADO / SANTA ROSA
UPDATE public.distrito SET ubigeo = '220305' WHERE id_distrito = 1770 AND ubigeo IS NULL; -- SAN MARTIN / EL DORADO / SHATOJA
UPDATE public.distrito SET ubigeo = '220401' WHERE id_distrito = 1771 AND ubigeo IS NULL; -- SAN MARTIN / HUALLAGA / SAPOSOA
UPDATE public.distrito SET ubigeo = '220402' WHERE id_distrito = 1772 AND ubigeo IS NULL; -- SAN MARTIN / HUALLAGA / ALTO SAPOSOA
UPDATE public.distrito SET ubigeo = '220403' WHERE id_distrito = 1773 AND ubigeo IS NULL; -- SAN MARTIN / HUALLAGA / EL ESLABON
UPDATE public.distrito SET ubigeo = '220404' WHERE id_distrito = 1774 AND ubigeo IS NULL; -- SAN MARTIN / HUALLAGA / PISCOYACU
UPDATE public.distrito SET ubigeo = '220405' WHERE id_distrito = 1775 AND ubigeo IS NULL; -- SAN MARTIN / HUALLAGA / SACANCHE
UPDATE public.distrito SET ubigeo = '220406' WHERE id_distrito = 1776 AND ubigeo IS NULL; -- SAN MARTIN / HUALLAGA / TINGO DE SAPOSOA
UPDATE public.distrito SET ubigeo = '220501' WHERE id_distrito = 1777 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / LAMAS
UPDATE public.distrito SET ubigeo = '220502' WHERE id_distrito = 1778 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / ALONSO DE ALVARADO
UPDATE public.distrito SET ubigeo = '220503' WHERE id_distrito = 1779 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / BARRANQUITA
UPDATE public.distrito SET ubigeo = '220506' WHERE id_distrito = 1782 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / PINTO RECODO
UPDATE public.distrito SET ubigeo = '220507' WHERE id_distrito = 1783 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / RUMISAPA
UPDATE public.distrito SET ubigeo = '220508' WHERE id_distrito = 1784 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / SAN ROQUE DE CUMBAZA
UPDATE public.distrito SET ubigeo = '220509' WHERE id_distrito = 1785 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / SHANAO
UPDATE public.distrito SET ubigeo = '220510' WHERE id_distrito = 1786 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / TABALOSOS
UPDATE public.distrito SET ubigeo = '220511' WHERE id_distrito = 1787 AND ubigeo IS NULL; -- SAN MARTIN / LAMAS / ZAPATERO
UPDATE public.distrito SET ubigeo = '220601' WHERE id_distrito = 1788 AND ubigeo IS NULL; -- SAN MARTIN / MARISCAL CACERES / JUANJUI
UPDATE public.distrito SET ubigeo = '220602' WHERE id_distrito = 1789 AND ubigeo IS NULL; -- SAN MARTIN / MARISCAL CACERES / CAMPANILLA
UPDATE public.distrito SET ubigeo = '220603' WHERE id_distrito = 1790 AND ubigeo IS NULL; -- SAN MARTIN / MARISCAL CACERES / HUICUNGO
UPDATE public.distrito SET ubigeo = '220604' WHERE id_distrito = 1791 AND ubigeo IS NULL; -- SAN MARTIN / MARISCAL CACERES / PACHIZA
UPDATE public.distrito SET ubigeo = '220605' WHERE id_distrito = 1792 AND ubigeo IS NULL; -- SAN MARTIN / MARISCAL CACERES / PAJARILLO
UPDATE public.distrito SET ubigeo = '220701' WHERE id_distrito = 1793 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / PICOTA
UPDATE public.distrito SET ubigeo = '220702' WHERE id_distrito = 1794 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / BUENOS AIRES
UPDATE public.distrito SET ubigeo = '220703' WHERE id_distrito = 1795 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / CASPISAPA
UPDATE public.distrito SET ubigeo = '220704' WHERE id_distrito = 1796 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / PILLUANA
UPDATE public.distrito SET ubigeo = '220705' WHERE id_distrito = 1797 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / PUCACACA
UPDATE public.distrito SET ubigeo = '220706' WHERE id_distrito = 1798 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / SAN CRISTOBAL
UPDATE public.distrito SET ubigeo = '220707' WHERE id_distrito = 1799 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / SAN HILARION
UPDATE public.distrito SET ubigeo = '220708' WHERE id_distrito = 1800 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / SHAMBOYACU
UPDATE public.distrito SET ubigeo = '220709' WHERE id_distrito = 1801 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / TINGO DE PONASA
UPDATE public.distrito SET ubigeo = '220710' WHERE id_distrito = 1802 AND ubigeo IS NULL; -- SAN MARTIN / PICOTA / TRES UNIDOS
UPDATE public.distrito SET ubigeo = '220801' WHERE id_distrito = 1803 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / RIOJA
UPDATE public.distrito SET ubigeo = '220802' WHERE id_distrito = 1804 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / AWAJUN
UPDATE public.distrito SET ubigeo = '220803' WHERE id_distrito = 1805 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / ELIAS SOPLIN VARGAS
UPDATE public.distrito SET ubigeo = '220804' WHERE id_distrito = 1806 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / NUEVA CAJAMARCA
UPDATE public.distrito SET ubigeo = '220805' WHERE id_distrito = 1807 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / PARDO MIGUEL
UPDATE public.distrito SET ubigeo = '220806' WHERE id_distrito = 1808 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / POSIC
UPDATE public.distrito SET ubigeo = '220807' WHERE id_distrito = 1809 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / SAN FERNANDO
UPDATE public.distrito SET ubigeo = '220808' WHERE id_distrito = 1810 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / YORONGOS
UPDATE public.distrito SET ubigeo = '220809' WHERE id_distrito = 1811 AND ubigeo IS NULL; -- SAN MARTIN / RIOJA / YURACYACU
UPDATE public.distrito SET ubigeo = '220901' WHERE id_distrito = 1812 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / TARAPOTO
UPDATE public.distrito SET ubigeo = '220902' WHERE id_distrito = 1813 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / ALBERTO LEVEAU
UPDATE public.distrito SET ubigeo = '220903' WHERE id_distrito = 1814 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / CACATACHI
UPDATE public.distrito SET ubigeo = '220904' WHERE id_distrito = 1815 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / CHAZUTA
UPDATE public.distrito SET ubigeo = '220905' WHERE id_distrito = 1816 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / CHIPURANA
UPDATE public.distrito SET ubigeo = '220906' WHERE id_distrito = 1817 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / EL PORVENIR
UPDATE public.distrito SET ubigeo = '220907' WHERE id_distrito = 1818 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / HUIMBAYOC
UPDATE public.distrito SET ubigeo = '220908' WHERE id_distrito = 1819 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / JUAN GUERRA
UPDATE public.distrito SET ubigeo = '220909' WHERE id_distrito = 1820 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / LA BANDA DE SHILCAYO
UPDATE public.distrito SET ubigeo = '220910' WHERE id_distrito = 1821 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / MORALES
UPDATE public.distrito SET ubigeo = '220911' WHERE id_distrito = 1822 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / PAPAPLAYA
UPDATE public.distrito SET ubigeo = '220912' WHERE id_distrito = 1823 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / SAN ANTONIO
UPDATE public.distrito SET ubigeo = '220913' WHERE id_distrito = 1824 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / SAUCE
UPDATE public.distrito SET ubigeo = '220914' WHERE id_distrito = 1825 AND ubigeo IS NULL; -- SAN MARTIN / SAN MARTIN / SHAPAJA
UPDATE public.distrito SET ubigeo = '221001' WHERE id_distrito = 1826 AND ubigeo IS NULL; -- SAN MARTIN / TOCACHE / TOCACHE
UPDATE public.distrito SET ubigeo = '221002' WHERE id_distrito = 1827 AND ubigeo IS NULL; -- SAN MARTIN / TOCACHE / NUEVO PROGRESO
UPDATE public.distrito SET ubigeo = '221003' WHERE id_distrito = 1828 AND ubigeo IS NULL; -- SAN MARTIN / TOCACHE / POLVORA
UPDATE public.distrito SET ubigeo = '221005' WHERE id_distrito = 1830 AND ubigeo IS NULL; -- SAN MARTIN / TOCACHE / UCHIZA
UPDATE public.distrito SET ubigeo = '230101' WHERE id_distrito = 1832 AND ubigeo IS NULL; -- TACNA / TACNA / TACNA
UPDATE public.distrito SET ubigeo = '230102' WHERE id_distrito = 1833 AND ubigeo IS NULL; -- TACNA / TACNA / ALTO DE LA ALIANZA
UPDATE public.distrito SET ubigeo = '230103' WHERE id_distrito = 1834 AND ubigeo IS NULL; -- TACNA / TACNA / CALANA
UPDATE public.distrito SET ubigeo = '230104' WHERE id_distrito = 1835 AND ubigeo IS NULL; -- TACNA / TACNA / CIUDAD NUEVA
UPDATE public.distrito SET ubigeo = '230105' WHERE id_distrito = 1836 AND ubigeo IS NULL; -- TACNA / TACNA / INCLAN
UPDATE public.distrito SET ubigeo = '230106' WHERE id_distrito = 1837 AND ubigeo IS NULL; -- TACNA / TACNA / PACHIA
UPDATE public.distrito SET ubigeo = '230107' WHERE id_distrito = 1838 AND ubigeo IS NULL; -- TACNA / TACNA / PALCA
UPDATE public.distrito SET ubigeo = '230108' WHERE id_distrito = 1839 AND ubigeo IS NULL; -- TACNA / TACNA / POCOLLAY
UPDATE public.distrito SET ubigeo = '230109' WHERE id_distrito = 1840 AND ubigeo IS NULL; -- TACNA / TACNA / SAMA
UPDATE public.distrito SET ubigeo = '230110' WHERE id_distrito = 1841 AND ubigeo IS NULL; -- TACNA / TACNA / CORONEL GREGORIO ALBARRACIN LANCHIPA
UPDATE public.distrito SET ubigeo = '230201' WHERE id_distrito = 1843 AND ubigeo IS NULL; -- TACNA / CANDARAVE / CANDARAVE
UPDATE public.distrito SET ubigeo = '230202' WHERE id_distrito = 1844 AND ubigeo IS NULL; -- TACNA / CANDARAVE / CAIRANI
UPDATE public.distrito SET ubigeo = '230203' WHERE id_distrito = 1845 AND ubigeo IS NULL; -- TACNA / CANDARAVE / CAMILACA
UPDATE public.distrito SET ubigeo = '230204' WHERE id_distrito = 1846 AND ubigeo IS NULL; -- TACNA / CANDARAVE / CURIBAYA
UPDATE public.distrito SET ubigeo = '230205' WHERE id_distrito = 1847 AND ubigeo IS NULL; -- TACNA / CANDARAVE / HUANUARA
UPDATE public.distrito SET ubigeo = '230206' WHERE id_distrito = 1848 AND ubigeo IS NULL; -- TACNA / CANDARAVE / QUILAHUANI
UPDATE public.distrito SET ubigeo = '230301' WHERE id_distrito = 1849 AND ubigeo IS NULL; -- TACNA / JORGE BASADRE / LOCUMBA
UPDATE public.distrito SET ubigeo = '230302' WHERE id_distrito = 1850 AND ubigeo IS NULL; -- TACNA / JORGE BASADRE / ILABAYA
UPDATE public.distrito SET ubigeo = '230303' WHERE id_distrito = 1851 AND ubigeo IS NULL; -- TACNA / JORGE BASADRE / ITE
UPDATE public.distrito SET ubigeo = '230401' WHERE id_distrito = 1852 AND ubigeo IS NULL; -- TACNA / TARATA / TARATA
UPDATE public.distrito SET ubigeo = '230402' WHERE id_distrito = 1853 AND ubigeo IS NULL; -- TACNA / TARATA / HEROES ALBARRACIN
UPDATE public.distrito SET ubigeo = '230403' WHERE id_distrito = 1854 AND ubigeo IS NULL; -- TACNA / TARATA / ESTIQUE
UPDATE public.distrito SET ubigeo = '230404' WHERE id_distrito = 1855 AND ubigeo IS NULL; -- TACNA / TARATA / ESTIQUE-PAMPA
UPDATE public.distrito SET ubigeo = '230405' WHERE id_distrito = 1856 AND ubigeo IS NULL; -- TACNA / TARATA / SITAJARA
UPDATE public.distrito SET ubigeo = '230406' WHERE id_distrito = 1857 AND ubigeo IS NULL; -- TACNA / TARATA / SUSAPAYA
UPDATE public.distrito SET ubigeo = '230407' WHERE id_distrito = 1858 AND ubigeo IS NULL; -- TACNA / TARATA / TARUCACHI
UPDATE public.distrito SET ubigeo = '230408' WHERE id_distrito = 1859 AND ubigeo IS NULL; -- TACNA / TARATA / TICACO
UPDATE public.distrito SET ubigeo = '240101' WHERE id_distrito = 1860 AND ubigeo IS NULL; -- TUMBES / TUMBES / TUMBES
UPDATE public.distrito SET ubigeo = '240102' WHERE id_distrito = 1861 AND ubigeo IS NULL; -- TUMBES / TUMBES / CORRALES
UPDATE public.distrito SET ubigeo = '240103' WHERE id_distrito = 1862 AND ubigeo IS NULL; -- TUMBES / TUMBES / LA CRUZ
UPDATE public.distrito SET ubigeo = '240104' WHERE id_distrito = 1863 AND ubigeo IS NULL; -- TUMBES / TUMBES / PAMPAS DE HOSPITAL
UPDATE public.distrito SET ubigeo = '240105' WHERE id_distrito = 1864 AND ubigeo IS NULL; -- TUMBES / TUMBES / SAN JACINTO
UPDATE public.distrito SET ubigeo = '240106' WHERE id_distrito = 1865 AND ubigeo IS NULL; -- TUMBES / TUMBES / SAN JUAN DE LA VIRGEN
UPDATE public.distrito SET ubigeo = '240201' WHERE id_distrito = 1866 AND ubigeo IS NULL; -- TUMBES / CONTRALMIRANTE VILLAR / ZORRITOS
UPDATE public.distrito SET ubigeo = '240202' WHERE id_distrito = 1867 AND ubigeo IS NULL; -- TUMBES / CONTRALMIRANTE VILLAR / CASITAS
UPDATE public.distrito SET ubigeo = '240203' WHERE id_distrito = 1868 AND ubigeo IS NULL; -- TUMBES / CONTRALMIRANTE VILLAR / CANOAS DE PUNTA SAL
UPDATE public.distrito SET ubigeo = '240301' WHERE id_distrito = 1869 AND ubigeo IS NULL; -- TUMBES / ZARUMILLA / ZARUMILLA
UPDATE public.distrito SET ubigeo = '240302' WHERE id_distrito = 1870 AND ubigeo IS NULL; -- TUMBES / ZARUMILLA / AGUAS VERDES
UPDATE public.distrito SET ubigeo = '240303' WHERE id_distrito = 1871 AND ubigeo IS NULL; -- TUMBES / ZARUMILLA / MATAPALO
UPDATE public.distrito SET ubigeo = '240304' WHERE id_distrito = 1872 AND ubigeo IS NULL; -- TUMBES / ZARUMILLA / PAPAYAL
UPDATE public.distrito SET ubigeo = '250101' WHERE id_distrito = 1873 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / CALLERIA
UPDATE public.distrito SET ubigeo = '250102' WHERE id_distrito = 1874 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / CAMPOVERDE
UPDATE public.distrito SET ubigeo = '250103' WHERE id_distrito = 1875 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / IPARIA
UPDATE public.distrito SET ubigeo = '250104' WHERE id_distrito = 1876 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / MASISEA
UPDATE public.distrito SET ubigeo = '250105' WHERE id_distrito = 1877 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / YARINACOCHA
UPDATE public.distrito SET ubigeo = '250106' WHERE id_distrito = 1878 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / NUEVA REQUENA
UPDATE public.distrito SET ubigeo = '250107' WHERE id_distrito = 1879 AND ubigeo IS NULL; -- UCAYALI / CORONEL PORTILLO / MANANTAY
UPDATE public.distrito SET ubigeo = '250202' WHERE id_distrito = 1881 AND ubigeo IS NULL; -- UCAYALI / ATALAYA / SEPAHUA
UPDATE public.distrito SET ubigeo = '250203' WHERE id_distrito = 1882 AND ubigeo IS NULL; -- UCAYALI / ATALAYA / TAHUANIA
UPDATE public.distrito SET ubigeo = '250204' WHERE id_distrito = 1883 AND ubigeo IS NULL; -- UCAYALI / ATALAYA / YURUA
UPDATE public.distrito SET ubigeo = '250301' WHERE id_distrito = 1884 AND ubigeo IS NULL; -- UCAYALI / PADRE ABAD / PADRE ABAD
UPDATE public.distrito SET ubigeo = '250302' WHERE id_distrito = 1885 AND ubigeo IS NULL; -- UCAYALI / PADRE ABAD / IRAZOLA
UPDATE public.distrito SET ubigeo = '250303' WHERE id_distrito = 1886 AND ubigeo IS NULL; -- UCAYALI / PADRE ABAD / CURIMANA
UPDATE public.distrito SET ubigeo = '250401' WHERE id_distrito = 1891 AND ubigeo IS NULL; -- UCAYALI / PURUS / PURUS
