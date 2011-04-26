<?xml version="1.0" encoding = 'utf8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:param name="filename"/>

<xsl:template match="/">

    <svg version='1.1' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:ink='http://www.w3.org/2003/InkML' onload='Init(evt)'>

        <!-- Include the javascript -->
        <script type='text/ecmascript' xlink:href='inkml2svg.js'/>

        <!-- Include the file -->
        <xsl:copy-of select="document($filename)"/>

    </svg>

</xsl:template>

</xsl:stylesheet> 