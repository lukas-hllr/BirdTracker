<?xml version="1.0"?>

<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns="http://www.w3.org/2000/svg"
		>
  <xsl:output
      method="xml"
      indent="yes"
      media-type="image/svg" />
  
  <xsl:template match="data">
    <svg xmlns="http://www.w3.org/2000/svg" 
        width="{viewport/width}" 
        height="{viewport/height}" >
        <xsl:for-each select="birds/coordinate">
            <rect 
                x="{round(//viewport/width div (//viewport/coord-top-left/Longitude - //viewport/coord-bottom-right/Longitude) * (//viewport/coord-top-left/Longitude - Longitude))}" 
                y="{round(//viewport/height div (//viewport/coord-top-left/Latitude - //viewport/coord-bottom-right/Latitude) * (//viewport/coord-top-left/Latitude - Latitude))}" 
                width="16" 
                height="16" 
                fill="red" 
                stroke="black"
            />  
        </xsl:for-each>
    </svg>
  </xsl:template>
</xsl:stylesheet>