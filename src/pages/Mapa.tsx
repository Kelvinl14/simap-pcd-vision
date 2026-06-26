import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip as MapTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Users, MapPin, Activity } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { StatCard } from "@/components/dashboard/StatCard";

// @ts-expect-error: Ignore the type error for the _getIconUrl method
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Mock Data
const NEIGHBORHOODS = [
    "Centro",
    "Nova Caxias",
    "Campo de Belém",
    "Ponte",
    "Vila Alecrim",
    "Cohab",
];

const DISABILITIES = [
    "Física",
    "Visual",
    "Auditiva",
    "Intelectual",
    "Múltipla",
    "TEA",
];

const INSTITUTIONS = [
    "APAE",
    "AMA",
    "ADV",
    "Centro de Reabilitação",
    "Nenhuma",
];

// Generate mock points
const generatePoints = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        lat: -4.86 + (Math.random() - 0.5) * 0.05,
        lng: -43.35 + (Math.random() - 0.5) * 0.05,
        neighborhood: NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)],
        disability: DISABILITIES[Math.floor(Math.random() * DISABILITIES.length)],
        age: Math.floor(Math.random() * 80),
        gender: Math.random() > 0.5 ? "Masculino" : "Feminino",
        institution: INSTITUTIONS[Math.floor(Math.random() * INSTITUTIONS.length)],
    }));
};

const MOCK_DATA = generatePoints(150);

const Mapa = () => {
    const [filters, setFilters] = useState({
        disability: "all",
        ageGroup: "all",
        gender: "all",
        institution: "all",
    });

    const filteredData = useMemo(() => {
        return MOCK_DATA.filter((item) => {
            if (filters.disability !== "all" && item.disability !== filters.disability) return false;
            if (filters.gender !== "all" && item.gender !== filters.gender) return false;
            if (filters.institution !== "all" && item.institution !== filters.institution) return false;

            if (filters.ageGroup !== "all") {
                if (filters.ageGroup === "0-18" && item.age > 18) return false;
                if (filters.ageGroup === "19-59" && (item.age < 19 || item.age > 59)) return false;
                if (filters.ageGroup === "60+" && item.age < 60) return false;
            }

            return true;
        });
    }, [filters]);

    const stats = useMemo(() => {
        const total = filteredData.length;
        const byDisability = filteredData.reduce((acc, item) => {
            acc[item.disability] = (acc[item.disability] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topRegion = Object.entries(
            filteredData.reduce((acc, item) => {
                acc[item.neighborhood] = (acc[item.neighborhood] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])[0];

        return { total, byDisability, topRegion };
    }, [filteredData]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Mapa de PCDs</h1>
                <p className="page-description">
                    Visualização georreferenciada dos cadastros em Caxias, MA.
                </p>
            </div>
           
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 stagger-children">
                <StatCard
                title="Total Exibido"
                value={stats.total}
                icon={<Users className="h-full w-full text-muted-foreground" />}
                description="Total de cadastros filtrados"
                />
                <StatCard
                title="Maior Concentração"
                value={stats.topRegion ? stats.topRegion[0] : "-"}
                icon={<MapPin className="h-full w-full text-muted-foreground" />}
                description={stats.topRegion ? `${stats.topRegion[1]} cadastros` : "Sem dados"}
                />
                <StatCard
                title="Tipo Predominante"
                value={Object.entries(stats.byDisability).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                icon={<Activity className="h-full w-full text-muted-foreground" />}
                description="36% do total"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-4 items-stretch">
                {/* Filters Sidebar */}
                <div className="space-y-6 lg:col-span-1 h-full overflow-y-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtros
                            </CardTitle>
                            <CardDescription>Refine a visualização do mapa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tipo de Deficiência</Label>
                                <Select
                                    value={filters.disability}
                                    onValueChange={(v) => setFilters({ ...filters, disability: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {DISABILITIES.map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Faixa Etária</Label>
                                <Select
                                    value={filters.ageGroup}
                                    onValueChange={(v) => setFilters({ ...filters, ageGroup: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="0-18">0 - 18 anos</SelectItem>
                                        <SelectItem value="19-59">19 - 59 anos</SelectItem>
                                        <SelectItem value="60+">60+ anos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Gênero</Label>
                                <Select
                                    value={filters.gender}
                                    onValueChange={(v) => setFilters({ ...filters, gender: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="Masculino">Masculino</SelectItem>
                                        <SelectItem value="Feminino">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Instituição de Referência</Label>
                                <Select
                                    value={filters.institution}
                                    onValueChange={(v) => setFilters({ ...filters, institution: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {INSTITUTIONS.map((i) => (
                                            <SelectItem key={i} value={i}>{i}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setFilters({
                                    disability: "all",
                                    ageGroup: "all",
                                    gender: "all",
                                    institution: "all",
                                })}
                            >
                                Limpar Filtros
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Distribuição</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(stats.byDisability)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between text-sm">
                                            <span>{type}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{count}</span>
                                                <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Area */}
                <div className="min-h-[400px] overflow-hidden rounded-xl border bg-card lg:col-span-3">
                    <MapContainer
                        center={[-4.86, -43.35]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {filteredData.map((point) => (
                            <CircleMarker
                                key={point.id}
                                center={[point.lat, point.lng]}
                                radius={8}
                                pathOptions={{
                                    fillColor: point.gender === "Masculino" ? "#3b82f6" : "#ec4899",
                                    color: "#fff",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8,
                                }}
                            >
                                <Popup>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{point.neighborhood}</h3>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Deficiência:</span> {point.disability}</p>
                                            <p><span className="font-medium">Idade:</span> {point.age} anos</p>
                                            <p><span className="font-medium">Gênero:</span> {point.gender}</p>
                                            <p><span className="font-medium">Instituição:</span> {point.institution}</p>
                                        </div>
                                    </div>
                                </Popup>
                                <MapTooltip>{point.disability} - {point.neighborhood}</MapTooltip>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Mapa;
