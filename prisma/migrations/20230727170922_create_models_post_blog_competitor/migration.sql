-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'on queue',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "error" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "refTitle" TEXT NOT NULL,
    "refUrl" TEXT NOT NULL,
    "refContent" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cardListUrl" TEXT NOT NULL,
    "postCardEl" TEXT NOT NULL,
    "postTitleEl" TEXT NOT NULL,
    "postContentEl" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_title_key" ON "posts"("title");

-- CreateIndex
CREATE UNIQUE INDEX "posts_url_key" ON "posts"("url");

-- CreateIndex
CREATE UNIQUE INDEX "posts_content_key" ON "posts"("content");

-- CreateIndex
CREATE UNIQUE INDEX "posts_refTitle_key" ON "posts"("refTitle");

-- CreateIndex
CREATE UNIQUE INDEX "posts_refUrl_key" ON "posts"("refUrl");

-- CreateIndex
CREATE UNIQUE INDEX "posts_refContent_key" ON "posts"("refContent");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_url_key" ON "blogs"("url");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_name_key" ON "competitors"("name");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
