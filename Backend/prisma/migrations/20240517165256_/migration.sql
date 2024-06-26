-- CreateTable
CREATE TABLE "Destino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "codigoPedido" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServicoDetalhe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "detalhes" TEXT NOT NULL,
    "servicoId" INTEGER NOT NULL,
    CONSTRAINT "ServicoDetalhe_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "prazo" INTEGER NOT NULL,
    "prazoFinal" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,
    CONSTRAINT "Servico_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
