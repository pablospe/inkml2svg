// http://www.schepers.cc/svg/inkml/InkML2SVG.svg
// by Schepers
// Saturday, November 17, 2007

// <script><![CDATA[
var SVGDocument = null;
var SVGRoot = null;
var svgns = 'http://www.w3.org/2000/svg';
var xlinkns = 'http://www.w3.org/1999/xlink';
var inkns = 'http://www.w3.org/2003/InkML';

function Init(evt)
{
    SVGDocument = evt.target.ownerDocument;
    SVGRoot = SVGDocument.documentElement;

    ConvertInk();
};

function ConvertInk()
{
    var pathGroup = SVGDocument.createElementNS(svgns, 'g');

    var traceEls = SVGDocument.getElementsByTagNameNS( inkns,'trace' );
    for ( var i = 0, iLen = traceEls.length; iLen > i; i++ )
    {
    var eachTraceEl = traceEls.item(i);
    var eachTraceData = eachTraceEl.firstChild.nodeValue;
    //alert(eachTraceData)
    eachTraceData = eachTraceData.replace(/^\s*|\s*$/g, "");
    //eachTraceData = eachTraceData.replace("  ", " ");

    CreateTrace( i, eachTraceData, pathGroup );
    }

    SVGRoot.appendChild( pathGroup );

    var outline = pathGroup.getBBox();
    var vb = (outline.x - 20) + ' ' + (outline.y - 20) + ' ' + (outline.width + 40) + ' ' + (outline.height + 40);
    SVGRoot.setAttribute( 'viewBox',  vb );

    var background = SVGDocument.createElementNS(svgns, 'rect');
    background.setAttribute( 'id', 'background' );
    background.setAttribute( 'x', outline.x - 20 );
    background.setAttribute( 'y', outline.y - 20 );
    background.setAttribute( 'width',  outline.width + 40 );
    background.setAttribute( 'height', outline.height + 40 );
    background.setAttribute( 'stroke', 'green' );
    background.setAttribute( 'fill', 'white' );

    SVGRoot.insertBefore( background, pathGroup );
    background.addEventListener( 'click', ResetAnimation, false);

    var fontSize = 10;

    var newLabel = SVGDocument.createElementNS(svgns, 'text');
    newLabel.setAttribute( 'id', 'instructions');
    newLabel.setAttribute( 'x', (outline.x + (outline.width/2)) );
    newLabel.setAttribute( 'y', (outline.y + fontSize - 18) );
    newLabel.setAttribute( 'font-size', fontSize );
    newLabel.setAttribute( 'font-family', 'Verdana' );
    newLabel.setAttribute( 'text-anchor', 'middle');
    newLabel.setAttribute( 'pointer-events', 'none');
    newLabel.setAttribute( 'fill', 'gray');

    var labelText = SVGDocument.createTextNode('Click on background to animate ink.  Mouse over shapes to show capture points.');
    newLabel.appendChild(labelText);

    SVGRoot.insertBefore( newLabel, pathGroup );


    setTimeout( 'AnimateShapes()', 10 );
};

function CreateTrace( i, data, group )
{
    var shape = CreatePath( data );
    var samples = CreateSamples( data );

    shape.setAttribute( 'id',  't' + i );
    shape.addEventListener( 'mouseover', ShowSamples, false);
    shape.addEventListener( 'mouseout', HideSamples, false);

    samples.setAttribute( 'id',  't' + i + '-s' );
    samples.setAttribute( 'display',  'none' );
    samples.setAttribute( 'pointer-events',  'none' );

    var traceGroup = SVGDocument.createElementNS(svgns, 'g');
    traceGroup.appendChild( shape );
    traceGroup.appendChild( samples );

    group.appendChild( traceGroup );
};

function CreatePath( data )
{
    var shape = SVGDocument.createElementNS(svgns, 'path');
    shape.setAttribute( 'd', 'M' + data );
    shape.setAttribute( 'fill',  'none' );
    shape.setAttribute( 'stroke', 'blue' );

    return shape;
};

function CreateSamples( data )
{
    var sampleGroup = SVGDocument.createElementNS(svgns, 'g');

    var points = data.split(',');
    //alert(points)
    for ( var i = 0, iLen = points.length; iLen > i; i++ )
    {
    var eachPoint = points[ i ];
    eachPoint = eachPoint.replace(/^\s*|\s*$/g, "");
    var pointSplit = eachPoint.split(' ');
    //alert(eachPoint + '\n x: ' + pointSplit[ 0 ] + '\n y: ' + pointSplit[ 1 ] );

    var dot = SVGDocument.createElementNS(svgns, 'circle');
    dot.setAttribute( 'r', 2.5 );
    dot.setAttribute( 'cx', pointSplit[ 0 ] );
    dot.setAttribute( 'cy', pointSplit[ 1 ] );
    dot.setAttribute( 'stroke', 'black' );

    var fill = 'yellow';
    if ( 0 == i )
    {
        fill = 'lime';
    }
    else if ( iLen - 1 == i )
    {
        fill = 'red';
    }

    dot.setAttribute( 'fill',  fill );
    sampleGroup.appendChild( dot );
    }

    return sampleGroup;
};

function ShowSamples( evt )
{
    var targetEl = evt.target;
    var targetId = targetEl.getAttribute( 'id' );
    var samples = SVGDocument.getElementById( targetId + '-s' );
    samples.setAttribute( 'display',  'inline' );
};

function HideSamples( evt )
{
    var targetEl = evt.target;
    var targetId = targetEl.getAttribute( 'id' );
    var samples = SVGDocument.getElementById( targetId + '-s' );
    samples.setAttribute( 'display',  'none' );
};


function AnimateShapes()
{
    var startAnim = null;

    var pathEls = SVGDocument.getElementsByTagNameNS( svgns, 'path' );
    for ( var i = 0, iLen = pathEls.length; iLen > i; i++ )
    {
    var eachPathEl = pathEls.item(i);

    var pathLength = eachPathEl.getTotalLength();
    eachPathEl.setAttribute( 'stroke-dasharray', pathLength + ' ' + pathLength);
    eachPathEl.setAttribute( 'stroke-dashoffset', 0 );

    var dur = 2;
    var begin = 'a_' + (i - 1) + '.end';
    if ( 0 == i )
    {
        begin = 'background.click + 0.5s';
        path1 = null;
    }

    var animId = 'a_' + i;

    var hide = CreateHide( pathLength );
    //eachPathEl.appendChild( hide );

    var animation = CreateAnimation( animId, begin, dur, pathLength );
    eachPathEl.appendChild( animation );
    }
};

function CreateHide( length )
{
    var set = SVGDocument.createElementNS(svgns, 'set');
    set.setAttribute( 'attributeName', 'stroke-dashoffset');
    set.setAttribute( 'attributeType', 'XML');
    set.setAttribute( 'begin', 'background.click' );
    set.setAttribute( 'to', length );
    set.setAttribute( 'dur', '1s');
    set.setAttribute( 'fill', 'freeze');
    set.setAttribute( 'restart', 'whenNotActive');

    return set;
};

function CreateAnimation(animId, begin, dur, length)
{
    var animation = SVGDocument.createElementNS(svgns, 'animate');
    animation.setAttribute( 'id', animId );
    animation.setAttribute( 'attributeName', 'stroke-dashoffset');
    animation.setAttribute( 'attributeType', 'XML');
    animation.setAttribute( 'begin', begin );
    animation.setAttribute( 'from', length);
    animation.setAttribute( 'to', '0');
    animation.setAttribute( 'dur', dur + 's');
    animation.setAttribute( 'fill', 'freeze');
    animation.setAttribute( 'restart', 'whenNotActive');

    return animation;
};


function ResetAnimation()
{
    var pathEls = SVGDocument.getElementsByTagNameNS( svgns, 'path' );
    for ( var i = 0, iLen = pathEls.length; iLen > i; i++ )
    {
    var eachPathEl = pathEls.item(i);

    var pathLength = eachPathEl.getTotalLength();
    eachPathEl.setAttribute( 'stroke-dasharray', pathLength + ' ' + pathLength);
    eachPathEl.setAttribute( 'stroke-dashoffset', pathLength);
    }
};
// ]]></script>
