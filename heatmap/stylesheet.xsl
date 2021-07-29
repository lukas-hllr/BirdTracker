<?xml version="1.0"?>
<xsl:stylesheet 
    version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:math="http://www.w3.org/2005/xpath-functions/math"
    xmlns="http://www.w3.org/2000/svg">
  
    <xsl:output
        method="xml"
        indent="yes"
        media-type="image/svg" />

    <xsl:param name="vp_tl_lng" as="xs:double" required="yes"/>
    <xsl:param name="vp_tl_lat" as="xs:double" required="yes"/>
    <xsl:param name="vp_br_lng" as="xs:double" required="yes"/>
    <xsl:param name="vp_br_lat" as="xs:double" required="yes"/>

    <xsl:param name="vp_width" required="yes"/>
    <xsl:param name="vp_height" required="yes"/>

    <xsl:param name="pixel_size" required="yes"/>
    <xsl:param name="cr" required="yes"/>

    <xsl:param name="zoom" required="yes"/>

    <xsl:template name="generateExampleHeatPoint">
        <xsl:param name="angle" as="xs:integer" required="yes"/>
        <xsl:param name="circleRadius" as="xs:integer" required="yes"/>
        <xsl:param name="r" as="xs:integer" required="yes"/>
        <xsl:param name="prevX" as="xs:integer" required="yes"/>
        <xsl:param name="prevY" as="xs:integer" required="yes"/>

    	<xsl:choose>
            <xsl:when test="$angle lt 90">
                <xsl:variable name="newX" as="xs:integer" select="xs:integer(round($r * math:sin($angle * math:pi() div 180 )))"/>
                <xsl:variable name="newY" as="xs:integer" select="xs:integer(round($r * math:cos($angle * math:pi() div 180 )))"/>
                <xsl:choose>
                    <xsl:when test="not($prevX eq $newX and $prevY eq $newY)">
                        <xsl:variable name="value" as="xs:double" select="(($circleRadius - math:sqrt(math:pow($newX, 2) + math:pow($newY, 2))*0.85) div $circleRadius)*$zoom"/>
                        <dataPoint gridX="{$newX}" gridY="{$newY}" value="{$value}"/>
                        <dataPoint gridX="{- $newX}" gridY="{$newY}" value="{$value}"/>
                        <dataPoint gridX="{$newX}" gridY="{- $newY}" value="{$value}"/>
                        <dataPoint gridX="{- $newX}" gridY="{- $newY}" value="{$value}"/>

                        <xsl:call-template name="generateExampleHeatPoint">
                            <xsl:with-param name="angle" select = "$angle+1"/>
                            <xsl:with-param name="circleRadius" select = "$circleRadius"/>
                            <xsl:with-param name="r" select = "$r"/>
                            <xsl:with-param name="prevX" select = "$newX"/>
                            <xsl:with-param name="prevY" select = "$newY"/>
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="generateExampleHeatPoint">
                            <xsl:with-param name="angle" select = "$angle+1"/>
                            <xsl:with-param name="circleRadius" select = "$circleRadius"/>
                            <xsl:with-param name="r" select = "$r"/>
                            <xsl:with-param name="prevX" select = "$prevX"/>
                            <xsl:with-param name="prevY" select = "$prevY"/>
                        </xsl:call-template>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:when test="$r gt 0">
                <xsl:call-template name="generateExampleHeatPoint">
                    <xsl:with-param name="angle" select = "0"/>
                    <xsl:with-param name="circleRadius" select = "$circleRadius"/>
                    <xsl:with-param name="r" select = "$r - 1"/>
                    <xsl:with-param name="prevX" select = "-1"/>
                    <xsl:with-param name="prevY" select = "-1"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:variable name="exampleHeatPoint" as="element()*">
        <xsl:variable name="exampleHeatPointND" as="element()*">
            <xsl:call-template name="generateExampleHeatPoint">
                <xsl:with-param name="angle" select = "0"/>
                <xsl:with-param name="circleRadius" select = "$cr"/>
                <xsl:with-param name="r" select = "$cr"/>
                <xsl:with-param name="prevX" select = "-1"/>
                <xsl:with-param name="prevY" select = "-1"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:for-each-group select="$exampleHeatPointND" group-by="@gridX">
            <xsl:variable name="currentX" select="current-grouping-key()"/>
            <xsl:for-each-group select="current-group()" group-by="@gridY">
                <xsl:variable name="currentY" select="current-grouping-key()"/>
                <xsl:element name="dataPoint">
                    <xsl:attribute name="gridX">
                        <xsl:value-of select="$currentX"/>
                    </xsl:attribute>
                    <xsl:attribute name="gridY">
                        <xsl:value-of select="$currentY" />
                    </xsl:attribute>
                    <xsl:attribute name="value">
                        <xsl:value-of select="max(current-group()/@value)" />
                    </xsl:attribute>
                </xsl:element>
            </xsl:for-each-group>
        </xsl:for-each-group>
    </xsl:variable>
  
    <xsl:template match="ArrayOfBird">
    
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="{$vp_width}" 
            height="{$vp_height}" >

            <filter id="gaussian-blur">
                <feGaussianBlur stdDeviation="10" />
            </filter>

            <g id="blurry_layer" filter="url(#gaussian-blur)">
            <!-- filter="url(#gaussian-blur)" -->

                <xsl:variable name="singleDataPoints" as="element()*">
                    <xsl:for-each select="Bird[number(Longitude) gt $vp_tl_lng and number(Longitude) lt $vp_br_lng and number(Latitude) lt $vp_tl_lat and number(Latitude) gt $vp_br_lat]">
                        <xsl:variable name="bird_lng" as="xs:double" select="Longitude"/>
                        <xsl:variable name="bird_lat" as="xs:double" select="Latitude"/>
                        <xsl:variable name="centerX" select="floor(($vp_width div ($vp_tl_lng - $vp_br_lng) * ($vp_tl_lng - $bird_lng)) div $pixel_size)"/>
                        <xsl:variable name="centerY" select="floor(($vp_height div ($vp_tl_lat - $vp_br_lat) * ($vp_tl_lat - $bird_lat)) div $pixel_size)"/>
                        <xsl:for-each select="$exampleHeatPoint">
                        
                            <xsl:element name="dataPoint">
                                <xsl:attribute name="gridX">
                                    <xsl:value-of select="$centerX + current()/@gridX"/>
                                </xsl:attribute>
                                <xsl:attribute name="gridY">
                                    <xsl:value-of select="$centerY + current()/@gridY"/>
                                </xsl:attribute>
                                <xsl:attribute name="value">
                                    <xsl:value-of select="current()/@value" />
                                </xsl:attribute>
                            </xsl:element>

                        </xsl:for-each>
                    </xsl:for-each>
                </xsl:variable>

                <xsl:variable name="groupedDataPoints" as="element()*">
                    <xsl:for-each-group select="$singleDataPoints" group-by="@gridX">
                        <xsl:variable name="currentX" select="current-grouping-key()"/>
                        <xsl:for-each-group select="current-group()" group-by="@gridY">
                            <xsl:variable name="currentY" select="current-grouping-key()"/>
                            <xsl:element name="dataPoint">
                                <xsl:attribute name="gridX">
                                    <xsl:value-of select="$currentX"/>
                                </xsl:attribute>
                                <xsl:attribute name="gridY">
                                    <xsl:value-of select="$currentY" />
                                </xsl:attribute>
                                <xsl:attribute name="value">
                                    <xsl:choose> 
                                        <xsl:when test="sum(current-group()/@value) lt 0.0">
                                            <xsl:value-of select="0.0"/>
                                        </xsl:when>
                                        <xsl:when test="sum(current-group()/@value) gt 1.0">
                                            <xsl:value-of select="1.0"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="sum(current-group()/@value)"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:attribute>
                            </xsl:element>
                        </xsl:for-each-group>
                    </xsl:for-each-group>
                </xsl:variable>  

                <xsl:for-each select="$groupedDataPoints">
                    <xsl:element name="rect">
                        <xsl:attribute name="x">
                            <xsl:value-of select="current()/@gridX * $pixel_size"/>
                        </xsl:attribute>
                        <xsl:attribute name="y">
                            <xsl:value-of select="current()/@gridY * $pixel_size"/>
                        </xsl:attribute>
                        <xsl:attribute name="width">
                            <xsl:value-of select="$pixel_size"/>
                        </xsl:attribute>
                        <xsl:attribute name="height">
                            <xsl:value-of select="$pixel_size"/>
                        </xsl:attribute>
                        <xsl:attribute name="style">
                            <xsl:variable name="value">
                                <xsl:choose> 
                                    <xsl:when test="number(current()/@value) lt 0.0">
                                        <xsl:value-of select="0.0"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="current()/@value"/>
                                    </xsl:otherwise>
                                </xsl:choose> 
                            </xsl:variable>
                            <xsl:variable name="h">
                                <xsl:value-of select="(1.0 - $value) * 200"/> 
                            </xsl:variable>
                            <xsl:value-of select="concat('fill: hsla(', $h, ', 100%, 50%, ', 0.6, ');')"/>
                        </xsl:attribute>
                    </xsl:element>
                </xsl:for-each>
            </g>
        </svg>
    </xsl:template>
</xsl:stylesheet>