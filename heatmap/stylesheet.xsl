<?xml version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">
  
    <xsl:output
        method="xml"
        indent="yes"
        media-type="image/svg" />

    <xsl:param name="vp_tl_lng" required="yes"/>
    <xsl:param name="vp_tl_lat" required="yes"/>
    <xsl:param name="vp_br_lng" required="yes"/>
    <xsl:param name="vp_br_lat" required="yes"/>

    <xsl:param name="vp_width" required="yes"/>
    <xsl:param name="vp_height" required="yes"/>
  
    <xsl:template match="ArrayOfBird">
    
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="{$vp_width}" 
            height="{$vp_height}" >

            <filter id="gaussian-blur">
                <feGaussianBlur stdDeviation="10" />
            </filter>

            <g id="layer3">
            <!-- filter="url(#gaussian-blur)" -->


                <xsl:for-each select="Bird[Longitude gt $vp_tl_lng and Longitude lt $vp_br_lng and Latitude lt $vp_tl_lat and Latitude gt $vp_br_lat]">

                    <xsl:variable name="bird_lng" select="Longitude"/>
                    <xsl:variable name="bird_lat" select="Latitude"/>

                    <rect 
                        x="{round($vp_width div ($vp_tl_lng - $vp_br_lng) * ($vp_tl_lng - $bird_lng))}" 
                        y="{round($vp_height div ($vp_tl_lat - $vp_br_lat) * ($vp_tl_lat - $bird_lat))}" 
                        width="16" 
                        height="16" 
                        fill="red" 
                        stroke="black"
                    />  
                </xsl:for-each>

            </g>
        </svg>
    </xsl:template>
</xsl:stylesheet>