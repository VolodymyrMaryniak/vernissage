namespace Vernissage.Api.Models;

/// <summary>
/// The kind of media asset attached to an <see cref="Exhibition"/>.
/// Covers both image assets and document/other-format assets (PDF, audio, VR, etc.).
/// </summary>
public enum MediaCategory
{
    /// <summary>Image of an individual artwork / art item in the exhibition.</summary>
    ArtworkImage = 0,

    /// <summary>Full exhibition-design photo (overall view, various angles).</summary>
    ExpoDesignFull = 1,

    /// <summary>Exhibition-design detail photo (close-up, various angles).</summary>
    ExpoDesignDetail = 2,

    /// <summary>Photo taken during an exhibition event.</summary>
    EventPhoto = 3,

    /// <summary>Exposition design plan document (e.g. PDF).</summary>
    ExpositionDesignPlan = 4,

    /// <summary>Location plan document (e.g. PDF).</summary>
    LocationPlan = 5,

    /// <summary>Audio used in the exhibition.</summary>
    Audio = 6,

    /// <summary>Lighting plan document (e.g. PDF).</summary>
    LightingPlan = 7,

    /// <summary>VR excursion file / asset.</summary>
    VrExcursion = 8,
}
